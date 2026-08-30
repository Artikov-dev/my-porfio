"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.submitContact = void 0;
const telegram_service_1 = require("../services/telegram.service");
const database_1 = require("../config/database");
const submitContact = async (req, res, next) => {
    try {
        const { name, email, subject, body, location } = req.body;
        const ip = req.ip || req.connection?.remoteAddress || 'Unknown IP';
        // 1. Save to Database (safely)
        try {
            await database_1.db.query('INSERT INTO contacts (name, email, subject, body, location, ip_address) VALUES ($1, $2, $3, $4, $5, $6)', [name, email, subject, body, location || 'Unknown', ip]);
        }
        catch (dbErr) {
            console.warn('Could not save contact message to DB, proceeding with notification:', dbErr);
        }
        // 2. Send Telegram Notification
        try {
            await telegram_service_1.TelegramService.sendContactMessage(name, email, subject, body, ip, location || 'Unknown');
        }
        catch (teleErr) {
            console.warn('Telegram notification failed:', teleErr);
        }
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
