"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("./logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
let isConnected = false;
const redisClient = new ioredis_1.default(REDIS_URL, {
    retryStrategy(times) {
        if (times > 3) {
            logger_1.logger.warn('⚠️ Could not connect to Redis. Caching will be disabled.');
            return null; // Stop retrying after 3 attempts
        }
        return Math.min(times * 100, 3000);
    },
    maxRetriesPerRequest: null,
});
redisClient.on('connect', () => {
    isConnected = true;
    logger_1.logger.info('📦 Successfully connected to Redis database');
});
redisClient.on('error', (err) => {
    if (isConnected) {
        logger_1.logger.error('❌ Redis Connection Error:', err);
    }
});
// Wrapper to safely execute commands without throwing if offline
exports.default = {
    get isConnected() {
        return isConnected;
    },
    async get(key) {
        if (!isConnected)
            return null;
        try {
            return await redisClient.get(key);
        }
        catch (e) {
            return null;
        }
    },
    async set(key, value, mode, duration) {
        if (!isConnected)
            return null;
        try {
            if (mode && duration)
                return await redisClient.set(key, value, mode, duration);
            return await redisClient.set(key, value);
        }
        catch (e) {
            return null;
        }
    },
    async del(key) {
        if (!isConnected)
            return null;
        try {
            return await redisClient.del(key);
        }
        catch (e) {
            return null;
        }
    },
    async incr(key) {
        if (!isConnected)
            return 1;
        try {
            return await redisClient.incr(key);
        }
        catch (e) {
            return 1;
        }
    },
    async decr(key) {
        if (!isConnected)
            return 0;
        try {
            return await redisClient.decr(key);
        }
        catch (e) {
            return 0;
        }
    },
};
