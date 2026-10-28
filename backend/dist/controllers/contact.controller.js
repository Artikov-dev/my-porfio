"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.submitContact = void 0;
const telegram_service_1 = require("../services/telegram.service");
const database_1 = require("../config/database");
const socket_1 = require("../config/socket");
const logger_1 = require("../config/logger");
const error_middleware_1 = require("../middlewares/error.middleware");
const submitContact = async (req, res, next) => {
    try {
        const { name, email, subject, body, location } = req.body;
        const ip = req.ip || req.connection?.remoteAddress || 'Unknown IP';
        // 1. Save to Database (safely)
        let saved = false;
        try {
            await database_1.db.query('INSERT INTO contacts (name, email, subject, body, location, ip_address) VALUES ($1, $2, $3, $4, $5, $6)', [name, email, subject, body, location || 'Unknown', ip]);
            saved = true;
        }
        catch (dbErr) {
            logger_1.logger.warn(`Could not save contact message to DB, proceeding with notification: ${dbErr}`);
        }
        // 2. Send Telegram Notification
        let notified = false;
        try {
            notified = await telegram_service_1.TelegramService.sendContactMessage(name, email, subject, body, ip, location || 'Unknown');
        }
        catch (teleErr) {
            logger_1.logger.warn(`Telegram notification failed: ${teleErr}`);
        }
        // Neither stored nor delivered: tell the visitor, instead of a "sent" toast for a lost message
        if (!saved && !notified) {
            throw new error_middleware_1.CustomError('Message could not be delivered, please try again later', 503);
        }
        // 3. Notify connected admins only (never broadcast visitor emails to everyone)
        const io = req.app.get('io');
        if (io) {
            io.to(socket_1.ADMIN_ROOM).emit('new_contact_message', {
                name,
                email,
                subject,
                timestamp: new Date(),
            });
        }
        res
            .status(200)
            .json({ status: 'success', message: 'Message sent successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.submitContact = submitContact;
const getMessages = async (req, res, next) => {
    try {
        let contacts = [];
        let chats = [];
        try {
            const contactRes = await database_1.db.query('SELECT * FROM contacts ORDER BY created_at DESC');
            contacts = contactRes.rows || [];
        }
        catch (e) { }
        try {
            const chatRes = await database_1.db.query('SELECT * FROM chat_messages ORDER BY created_at DESC');
            chats = chatRes.rows || [];
        }
        catch (e) { }
        res.status(200).json({
            status: 'success',
            data: {
                contacts,
                chats,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessages = getMessages;
