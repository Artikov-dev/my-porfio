"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, printf, colorize, align } = winston_1.default.format;
const logFormat = printf((info) => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
});
exports.logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: combine(timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), logFormat),
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
        }),
        new winston_daily_rotate_file_1.default({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: combine(colorize(), align(), logFormat),
    }));
}
