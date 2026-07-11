"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.submitContact = void 0;
const telegram_service_1 = require("../services/telegram.service");
const database_1 = require("../config/database");
// Note: Normally we'd use a singleton or pass io instance here to emit socket events
// We will emit from socket later or attach io to req (req.app.get('io'))
const submitContact = async (req, res, next) => {
    try {
        const { name, email, subject, body, location } = req.body;
        const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';
        // 1. Save to Database
        await database_1.db.query('INSERT INTO contacts (name, email, subject, body, location, ip_address) VALUES ($1, $2, $3, $4, $5, $6)', [name, email, subject, body, location || 'Unknown', ip]);
        // 2. Send Telegram Notification
        await telegram_service_1.TelegramService.sendContactMessage(name, email, subject, body, ip, location || 'Unknown');
        // 3. Emit Socket Event (assuming io is set on app)
        const io = req.app.get('io');
        if (io) {
            io.emit('new_contact_message', {
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
        const contactRes = await database_1.db.query('SELECT * FROM contacts ORDER BY created_at DESC');
        const chatRes = await database_1.db.query('SELECT * FROM chat_messages ORDER BY created_at DESC');
        res.status(200).json({
            status: 'success',
            data: {
                contacts: contactRes.rows,
                chats: chatRes.rows,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessages = getMessages;
