import { Request, Response, NextFunction } from 'express';
import { TelegramService } from '../services/telegram.service';
import { db } from '../config/database';
import { ADMIN_ROOM } from '../config/socket';
import { logger } from '../config/logger';
import { CustomError } from '../middlewares/error.middleware';

// Nobody types a name, email and a 10+ character message in under 3 seconds
const MIN_FILL_TIME_MS = 3000;

export const submitContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, subject, body, location, website, elapsed_ms } = req.body;
    const ip = req.ip || req.socket.remoteAddress || 'Unknown IP';

    // Bots fill every field (including the hidden "website" one) and submit instantly.
    // Answer them with a normal success so they don't adapt, but store / send nothing.
    if (website || (typeof elapsed_ms === 'number' && elapsed_ms < MIN_FILL_TIME_MS)) {
      logger.warn(`Dropped likely spam contact submission from ${ip}`);
      return res.status(200).json({ status: 'success', message: 'Message sent successfully' });
    }

    // 1. Save to Database (safely)
    let saved = false;
    try {
      await db.query(
        'INSERT INTO contacts (name, email, subject, body, location, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, email, subject, body, location || 'Unknown', ip],
      );
      saved = true;
    } catch (dbErr) {
      logger.warn(`Could not save contact message to DB, proceeding with notification: ${dbErr}`);
    }

    // 2. Send Telegram Notification
    let notified = false;
    try {
      notified = await TelegramService.sendContactMessage(
        name,
        email,
        subject,
        body,
        ip,
        location || 'Unknown',
      );
    } catch (teleErr) {
      logger.warn(`Telegram notification failed: ${teleErr}`);
    }

    // Neither stored nor delivered: tell the visitor, instead of a "sent" toast for a lost message
    if (!saved && !notified) {
      throw new CustomError('Message could not be delivered, please try again later', 503);
    }

    // 3. Notify connected admins only (never broadcast visitor emails to everyone)
    const io = req.app.get('io');
    if (io) {
      io.to(ADMIN_ROOM).emit('new_contact_message', {
        name,
        email,
        subject,
        timestamp: new Date(),
      });
    }

    res
      .status(200)
      .json({ status: 'success', message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

// Newest contact messages first. Chats come oldest-first so each conversation reads top to
// bottom and live messages (appended by the admin page) land in the right place. Both are capped;
// a DB failure is reported as an error instead of an empty inbox that looks like "no messages".
const MESSAGE_LIMIT = 500;

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [contactRes, chatRes] = await Promise.all([
      db.query('SELECT * FROM contacts ORDER BY created_at DESC LIMIT $1', [MESSAGE_LIMIT]),
      db.query(
        `SELECT * FROM (
           SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT $1
         ) recent ORDER BY created_at ASC`,
        [MESSAGE_LIMIT],
      ),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        contacts: contactRes.rows,
        chats: chatRes.rows,
      },
    });
  } catch (error) {
    logger.error(`Failed to load messages: ${error}`);
    next(new CustomError('Could not load messages, the database is unavailable', 503));
  }
};

// A visitor's own conversation, so the chat widget survives a page reload. The session id is a
// random UUID only that browser knows, so it doubles as the access key. Older widget versions
// used short ids ('v_' + 8 base36 chars) that could be guessed; those get no history.
const UUID_SESSION_PATTERN = /^v_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = String(req.params.sessionId);
    if (!UUID_SESSION_PATTERN.test(sessionId)) {
      throw new CustomError('Invalid chat session', 400);
    }
    const result = await db.query(
      `SELECT id, text, is_admin, created_at FROM (
         SELECT id, text, is_admin, created_at FROM chat_messages
         WHERE session_id = $1 ORDER BY created_at DESC LIMIT 200
       ) recent ORDER BY created_at ASC`,
      [sessionId],
    );
    res.status(200).json({ status: 'success', data: result.rows });
  } catch (error) {
    next(error);
  }
};
