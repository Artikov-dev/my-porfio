"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = exports.ADMIN_ROOM = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("./logger");
const database_1 = require("./database");
const auth_service_1 = require("../services/auth.service");
const telegram_service_1 = require("../services/telegram.service");
// Private room that only authenticated admin sockets join.
// Chat transcripts and contact notifications are emitted here — never to everyone.
exports.ADMIN_ROOM = 'admins';
// Visitor chat session ids are generated client-side (LiveChat); accept only that shape.
// Older ids were 'v_' + up to 8 base36 chars, newer ones are UUIDs.
const SESSION_ID_PATTERN = /^v_[A-Za-z0-9-]{4,64}$/;
const MAX_NAME_LENGTH = 50;
const MAX_TEXT_LENGTH = 1000;
const CHAT_RATE_LIMIT = { max: 5, windowMs: 10_000 };
// Admin rights last only as long as the token from the handshake: an hour-old socket must not
// keep admin powers after the token expired or the admin logged out.
const isAdminSocket = (socket) => socket.data.isAdmin === true && Date.now() < (socket.data.adminUntil ?? 0);
const getCookie = (header, name) => {
    for (const part of (header || '').split(';')) {
        const [key, ...rest] = part.trim().split('=');
        if (key === name)
            return decodeURIComponent(rest.join('='));
    }
    return undefined;
};
// Reads the httpOnly accessToken cookie sent with the handshake (withCredentials: true).
// Returns when admin rights expire (ms), or 0 for a regular visitor.
const authenticateSocket = async (socket) => {
    try {
        const accessToken = getCookie(socket.handshake.headers.cookie, 'accessToken');
        if (accessToken) {
            const decoded = await auth_service_1.AuthService.verifyAccessToken(accessToken);
            return (decoded.exp ?? 0) * 1000;
        }
    }
    catch {
        // invalid / expired / revoked token → regular visitor
    }
    return 0;
};
const cleanString = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
const setupSocket = (server) => {
    const allowedOrigins = process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
        : ['http://localhost:5173'];
    const io = new socket_io_1.Server(server, {
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
    // Live count of open connections. A Redis counter used to be kept here, but it survived
    // server restarts (connections dropped without a disconnect event) and drifted upwards.
    // Admin tabs are not visitors, so they aren't counted.
    const broadcastActiveUsers = () => {
        let visitors = 0;
        for (const s of io.of('/').sockets.values()) {
            if (!s.data.isAdmin)
                visitors++;
        }
        io.emit('active_users_update', visitors);
    };
    // Auth runs as middleware (before 'connection'), so the event handlers below are attached
    // synchronously and a visitor's immediate join_room is never missed.
    io.use(async (socket, next) => {
        socket.data.adminUntil = await authenticateSocket(socket);
        socket.data.isAdmin = socket.data.adminUntil > Date.now();
        next();
    });
    io.on('connection', (socket) => {
        logger_1.logger.info(`🔌 Socket connected: ${socket.id}`);
        if (socket.data.isAdmin) {
            socket.join(exports.ADMIN_ROOM);
        }
        broadcastActiveUsers();
        socket.on('disconnect', () => {
            logger_1.logger.info(`🔌 Socket disconnected: ${socket.id}`);
            broadcastActiveUsers();
        });
        // A visitor joins their own chat session room to receive admin replies
        socket.on('join_room', (roomId) => {
            if (typeof roomId === 'string' && SESSION_ID_PATTERN.test(roomId)) {
                socket.join(roomId);
            }
        });
        socket.on('page_view', (page) => {
            logger_1.logger.info(`Page view recorded: ${cleanString(page, 200)} by ${socket.id}`);
        });
        // Simple per-socket sliding window to stop chat spam
        let chatTimestamps = [];
        // The visitor's widget passes an ack callback, so a message that wasn't stored is shown as
        // "not delivered" instead of looking sent
        socket.on('chat_message', async (data, ack) => {
            const respond = (result) => {
                if (typeof ack === 'function')
                    ack(result);
            };
            const now = Date.now();
            chatTimestamps = chatTimestamps.filter((t) => now - t < CHAT_RATE_LIMIT.windowMs);
            if (chatTimestamps.length >= CHAT_RATE_LIMIT.max) {
                socket.emit('chat_error', { message: 'Too many messages, please slow down.' });
                return respond({ ok: false, reason: 'rate_limited' });
            }
            chatTimestamps.push(now);
            const name = cleanString(data?.name, MAX_NAME_LENGTH) || 'Guest';
            const text = cleanString(data?.text, MAX_TEXT_LENGTH);
            const sessionId = typeof data?.visitor_id === 'string' && SESSION_ID_PATTERN.test(data.visitor_id)
                ? data.visitor_id
                : null;
            if (!text || !sessionId)
                return respond({ ok: false, reason: 'invalid' });
            socket.join(sessionId);
            try {
                const result = await database_1.db.query('INSERT INTO chat_messages (name, text, session_id, is_admin) VALUES ($1, $2, $3, false) RETURNING *', [name, text, sessionId]);
                io.to(exports.ADMIN_ROOM).emit('new_admin_message', result.rows[0]);
                respond({ ok: true });
            }
            catch (err) {
                logger_1.logger.error('Failed to save chat message:', err);
                return respond({ ok: false, reason: 'server' });
            }
            // The admin panel is usually closed — ping Telegram so nobody waits for nothing
            telegram_service_1.TelegramService.notifyChatMessage(name, text, sessionId).catch(() => { });
        });
        socket.on('admin_reply', async (data, ack) => {
            // The admin page passes an ack callback so a rejected reply is reported, not silently lost
            const respond = (result) => {
                if (typeof ack === 'function')
                    ack(result);
            };
            if (!isAdminSocket(socket)) {
                logger_1.logger.warn(`Rejected admin_reply from non-admin socket ${socket.id}`);
                socket.leave(exports.ADMIN_ROOM);
                return respond({ ok: false, reason: 'unauthorized' });
            }
            const text = cleanString(data?.text, MAX_TEXT_LENGTH);
            const sessionId = typeof data?.session_id === 'string' && SESSION_ID_PATTERN.test(data.session_id)
                ? data.session_id
                : null;
            if (!text || !sessionId)
                return respond({ ok: false, reason: 'invalid' });
            try {
                const result = await database_1.db.query('INSERT INTO chat_messages (name, text, session_id, is_admin) VALUES ($1, $2, $3, true) RETURNING *', ['Roma Artikov', text, sessionId]);
                // Send the reply only to that visitor's session room
                io.to(sessionId).emit('chat_reply', result.rows[0]);
                // Keep other admin tabs in sync
                io.to(exports.ADMIN_ROOM).emit('new_admin_message', result.rows[0]);
                respond({ ok: true });
            }
            catch (err) {
                logger_1.logger.error('Failed to save admin reply:', err);
                respond({ ok: false, reason: 'server' });
            }
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
