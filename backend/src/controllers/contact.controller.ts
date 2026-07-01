import { Request, Response, NextFunction } from 'express';
import { TelegramService } from '../services/telegram.service';
import { db } from '../config/database';
// Note: Normally we'd use a singleton or pass io instance here to emit socket events
// We will emit from socket later or attach io to req (req.app.get('io'))

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, body, location } = req.body;
    const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';
    
    // 1. Save to Database
    await db.query(
      'INSERT INTO contacts (name, email, subject, body, location, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, subject, body, location || 'Unknown', ip]
    );

    // 2. Send Telegram Notification
    await TelegramService.sendContactMessage(name, email, subject, body, ip, location || 'Unknown');
    
    // 3. Emit Socket Event (assuming io is set on app)
    const io = req.app.get('io');
    if (io) {
      io.emit('new_contact_message', { name, email, subject, timestamp: new Date() });
    }

    res.status(200).json({ status: 'success', message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactRes = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    const chatRes = await db.query('SELECT * FROM chat_messages ORDER BY created_at DESC');

    res.status(200).json({
      status: 'success',
      data: {
        contacts: contactRes.rows,
        chats: chatRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
};
