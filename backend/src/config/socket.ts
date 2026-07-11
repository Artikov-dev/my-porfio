import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { logger } from './logger';
import redisClient from './redis';
import { db } from './database';

export const setupSocket = (server: HttpServer) => {
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',')
    : ['http://localhost:5173'];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // In-memory fallback if Redis is down
  let memoryActiveUsers = 0;

  io.on('connection', async (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

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

    socket.on('page_view', (page: string) => {
      logger.info(`Page view recorded: ${page} by ${socket.id}`);
    });

    socket.on('chat_message', async (data: { name: string; text: string }) => {
      logger.info(`Chat message from ${data.name}: ${data.text}`);

      try {
        const result = await db.query(
          'INSERT INTO chat_messages (name, text, session_id, is_admin) VALUES ($1, $2, $3, false) RETURNING *',
          [data.name, data.text, socket.id],
        );
        // Broadcast to admins that a new message arrived
        io.emit('new_admin_message', result.rows[0]);
      } catch (err) {
        logger.error('Failed to save chat message:', err);
      }
    });

    socket.on(
      'admin_reply',
      async (data: { session_id: string; text: string }) => {
        logger.info(`Admin replying to ${data.session_id}: ${data.text}`);

        try {
          const result = await db.query(
            'INSERT INTO chat_messages (name, text, session_id, is_admin) VALUES ($1, $2, $3, true) RETURNING *',
            ['Roma Artikov', data.text, data.session_id],
          );

          // Send the reply specifically to the user's socket
          io.to(data.session_id).emit('chat_reply', result.rows[0]);
          // Also broadcast so other admin tabs can see it
          io.emit('new_admin_message', result.rows[0]);
        } catch (err) {
          logger.error('Failed to save admin reply:', err);
        }
      },
    );
  });

  return io;
};
