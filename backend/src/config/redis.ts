import Redis from 'ioredis';
import { logger } from './logger';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
let isConnected = false;

const redisClient = new Redis(REDIS_URL, {
  retryStrategy(times) {
    // Exponential backoff capped at 5 seconds to ensure reconnection works
    return Math.min(times * 200, 5000);
  },
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => {
  logger.info('📦 Connecting to Redis database...');
});

redisClient.on('ready', () => {
  isConnected = true;
  logger.info('📦 Successfully connected to Redis database');
});

redisClient.on('error', (err) => {
  if (isConnected) {
    logger.error('❌ Redis Connection Error:', err);
  }
  isConnected = false;
});

redisClient.on('close', () => {
  isConnected = false;
});

redisClient.on('end', () => {
  isConnected = false;
});

// Wrapper to safely execute commands without throwing if offline
export default {
  get isConnected() {
    return isConnected;
  },
  async get(key: string) {
    if (!isConnected) return null;
    try {
      return await redisClient.get(key);
    } catch (e) {
      return null;
    }
  },
  async set(key: string, value: string, mode?: any, duration?: any) {
    if (!isConnected) return null;
    try {
      if (mode && duration)
        return await redisClient.set(key, value, mode, duration);
      return await redisClient.set(key, value);
    } catch (e) {
      return null;
    }
  },
  async del(key: string) {
    if (!isConnected) return null;
    try {
      return await redisClient.del(key);
    } catch (e) {
      return null;
    }
  },
  async incr(key: string) {
    if (!isConnected) return 1;
    try {
      return await redisClient.incr(key);
    } catch (e) {
      return 1;
    }
  },
  async decr(key: string) {
    if (!isConnected) return 0;
    try {
      return await redisClient.decr(key);
    } catch (e) {
      return 0;
    }
  },
};
