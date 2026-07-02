"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("./logger");
const redis_1 = __importDefault(require("./redis"));
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    // In-memory fallback if Redis is down
    let memoryActiveUsers = 0;
    io.on('connection', async (socket) => {
        logger_1.logger.info(`🔌 Socket connected: ${socket.id}`);
        // Increment active users
        memoryActiveUsers++;
        let activeUsers = memoryActiveUsers;
        try {
            if (redis_1.default.isConnected) {
                await redis_1.default.incr('active_users');
                activeUsers = parseInt(await redis_1.default.get('active_users') || '0', 10);
            }
        }
        catch (e) {
            // fallback to memory
        }
        io.emit('active_users_update', activeUsers);
        socket.on('disconnect', async () => {
            logger_1.logger.info(`🔌 Socket disconnected: ${socket.id}`);
            memoryActiveUsers = Math.max(0, memoryActiveUsers - 1);
            let updatedActiveUsers = memoryActiveUsers;
            try {
                if (redis_1.default.isConnected) {
                    await redis_1.default.decr('active_users');
                    updatedActiveUsers = parseInt(await redis_1.default.get('active_users') || '0', 10);
                }
            }
            catch (e) {
                // fallback to memory
            }
            io.emit('active_users_update', Math.max(0, updatedActiveUsers));
        });
        socket.on('page_view', (page) => {
            logger_1.logger.info(`Page view recorded: ${page} by ${socket.id}`);
        });
        socket.on('chat_message', async (data) => {
            logger_1.logger.info(`Chat message from ${data.name}: ${data.text}`);
            try {
                const { db } = require('./database');
                const result = await db.query('INSERT INTO chat_messages (name, text, session_id, is_admin) VALUES ($1, $2, $3, false) RETURNING *', [data.name, data.text, socket.id]);
                // Broadcast to admins that a new message arrived
                io.emit('new_admin_message', result.rows[0]);
            }
            catch (err) {
                logger_1.logger.error('Failed to save chat message:', err);
            }
        });
        socket.on('admin_reply', async (data) => {
            logger_1.logger.info(`Admin replying to ${data.session_id}: ${data.text}`);
            try {
                const { db } = require('./database');
                const result = await db.query('INSERT INTO chat_messages (name, text, session_id, is_admin) VALUES ($1, $2, $3, true) RETURNING *', ['Roma Artikov', data.text, data.session_id]);
                // Send the reply specifically to the user's socket
                io.to(data.session_id).emit('chat_reply', result.rows[0]);
                // Also broadcast so other admin tabs can see it
                io.emit('new_admin_message', result.rows[0]);
            }
            catch (err) {
                logger_1.logger.error('Failed to save admin reply:', err);
            }
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
