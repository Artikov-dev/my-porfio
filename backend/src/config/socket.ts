import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from './logger';
import redisClient from './redis';
import { db } from './database';
import { AuthService } from '../services/auth.service';

// Private room that only authenticated admin sockets join.
// Chat transcripts and contact notifications are emitted here — never to everyone.
export const ADMIN_ROOM = 'admins';

// Visitor chat session ids are generated client-side (LiveChat); accept only that shape.
// Older ids were 'v_' + up to 8 base36 chars, newer ones are UUIDs.
const SESSION_ID_PATTERN = /^v_[A-Za-z0-9-]{4,64}$/;
const MAX_NAME_LENGTH = 50;
const MAX_TEXT_LENGTH = 1000;
const CHAT_RATE_LIMIT = { max: 5, windowMs: 10_000 };

const isAdminSocket = (socket: Socket) => socket.data.isAdmin === true;

const getCookie = (header: string | undefined, name: string) => {
  for (const part of (header || '').split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return undefined;
};

// Reads the httpOnly accessToken cookie sent with the handshake (withCredentials: true)
const authenticateSocket = (socket: Socket) => {
  try {
    const accessToken = getCookie(socket.handshake.headers.cookie, 'accessToken');
    if (accessToken) {
      AuthService.verifyAccessToken(accessToken);
      return true;
    }
  } catch {
    // invalid / expired token → regular visitor
  }
  return false;
};

const cleanString = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

export const setupSocket = (server: HttpServer) => {
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
    : ['http://localhost:5173'];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 16 * 1024, // chat messages are tiny; reject huge payloads
  });

  // In-memory fallback if Redis is down
  let memoryActiveUsers = 0;

  io.on('connection', async (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    socket.data.isAdmin = authenticateSocket(socket);
    if (socket.data.isAdmin) {
      socket.join(ADMIN_ROOM);
    }

    // Increment active users
    memoryActiveUsers++;
    let activeUsers = memoryActiveUsers;

    try {
      if (redisClient.isConnected) {
        await redisClient.incr('active_users');
        activeUsers = parseInt(
          (await redisClient.get('active_users')) || '0',
          10,
        );
      }
    } catch (e) {
      // fallback to memory
    }

    io.emit('active_users_update', activeUsers);

    socket.on('disconnect', async () => {
      logger.info(`🔌 Socket disconnected: ${socket.id}`);

      memoryActiveUsers = Math.max(0, memoryActiveUsers - 1);
      let updatedActiveUsers = memoryActiveUsers;

      try {
        if (redisClient.isConnected) {
          await redisClient.decr('active_users');
          updatedActiveUsers = parseInt(
            (await redisClient.get('active_users')) || '0',
            10,
          );
        }
      } catch (e) {
        // fallback to memory
      }

      io.emit('active_users_update', Math.max(0, updatedActiveUsers));
    });

    // A visitor joins their own chat session room to receive admin replies
    socket.on('join_room', (roomId: unknown) => {
      if (typeof roomId === 'string' && SESSION_ID_PATTERN.test(roomId)) {
        socket.join(roomId);
      }
    });

    socket.on('page_view', (page: unknown) => {
      logger.info(`Page view recorded: ${cleanString(page, 200)} by ${socket.id}`);
    });

    // Simple per-socket sliding window to stop chat spam
    let chatTimestamps: number[] = [];

    socket.on('chat_message', async (data: { name?: unknown; text?: unknown; visitor_id?: unknown }) => {
      const now = Date.now();
      chatTimestamps = chatTimestamps.filter((t) => now - t < CHAT_RATE_LIMIT.windowMs);
      if (chatTimestamps.length >= CHAT_RATE_LIMIT.max) {
        socket.emit('chat_error', { message: 'Too many messages, please slow down.' });
        return;
      }
      chatTimestamps.push(now);

      const name = cleanString(data?.name, MAX_NAME_LENGTH) || 'Guest';
      const text = cleanString(data?.text, MAX_TEXT_LENGTH);
      const sessionId = typeof data?.visitor_id === 'string' && SESSION_ID_PATTERN.test(data.visitor_id)
        ? data.visitor_id
        : null;
      if (!text || !sessionId) return;

      socket.join(sessionId);

      try {
        const result = await db.query(
          'INSERT INTO chat_messages (name, text, session_id, is_admin) VALUES ($1, $2, $3, false) RETURNING *',
          [name, text, sessionId],
        );
        io.to(ADMIN_ROOM).emit('new_admin_message', result.rows[0]);
      } catch (err) {
        logger.error('Failed to save chat message:', err);
      }
    });

    socket.on(
      'admin_reply',
      async (data: { session_id?: unknown; text?: unknown }) => {
        if (!isAdminSocket(socket)) {
          logger.warn(`Rejected admin_reply from non-admin socket ${socket.id}`);
          return;
        }

        const text = cleanString(data?.text, MAX_TEXT_LENGTH);
        const sessionId = typeof data?.session_id === 'string' && SESSION_ID_PATTERN.test(data.session_id)
          ? data.session_id
          : null;
        if (!text || !sessionId) return;

        try {
          const result = await db.query(
            'INSERT INTO chat_messages (name, text, session_id, is_admin) VALUES ($1, $2, $3, true) RETURNING *',
            ['Roma Artikov', text, sessionId],
          );

          // Send the reply only to that visitor's session room
          io.to(sessionId).emit('chat_reply', result.rows[0]);
          // Keep other admin tabs in sync
          io.to(ADMIN_ROOM).emit('new_admin_message', result.rows[0]);
        } catch (err) {
          logger.error('Failed to save admin reply:', err);
        }
      },
    );
  });

  return io;
};
