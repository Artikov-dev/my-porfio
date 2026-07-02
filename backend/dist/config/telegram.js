"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdminNotification = exports.bot = void 0;
const telegraf_1 = require("telegraf");
const logger_1 = require("./logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.TELEGRAM_BOT_TOKEN;
exports.bot = null;
if (token) {
    exports.bot = new telegraf_1.Telegraf(token);
    // Oddiy foydalanuvchilar (yoki o'zingiz) botga kirganda ishlaydigan xabar
    exports.bot.start((ctx) => {
        const chatId = ctx.chat.id;
        ctx.reply(`Assalomu alaykum! Roma Artikovning shaxsiy botiga xush kelibsiz.\n\nSizning Chat ID raqamingiz: ${chatId}\n\n(Agar siz Admin bo'lsangiz, shu ID ni .env faylidagi TELEGRAM_CHAT_ID ga kiritib qo'ying)`);
    });
    exports.bot.help((ctx) => {
        ctx.reply('Hozircha men faqat portfolioga tashriflarni adminga yetkazib beraman.');
    });
    // Botni ishga tushirish
    exports.bot.launch().then(() => {
        logger_1.logger.info('🤖 Telegram bot is running!');
    }).catch((err) => {
        logger_1.logger.error('Failed to start Telegram bot:', err);
    });
    // Graceful stop
    process.once('SIGINT', () => exports.bot?.stop('SIGINT'));
    process.once('SIGTERM', () => exports.bot?.stop('SIGTERM'));
}
else {
    logger_1.logger.warn('TELEGRAM_BOT_TOKEN is not defined. Telegram bot is disabled.');
}
const sendAdminNotification = async (message) => {
    if (!exports.bot)
        return;
    const adminChatId = process.env.TELEGRAM_CHAT_ID;
    if (!adminChatId) {
        logger_1.logger.warn('TELEGRAM_CHAT_ID is not defined. Cannot send notification.');
        return;
    }
    try {
        await exports.bot.telegram.sendMessage(adminChatId, message, { parse_mode: 'HTML' });
    }
    catch (error) {
        logger_1.logger.error('Failed to send telegram notification:', error);
    }
};
exports.sendAdminNotification = sendAdminNotification;
