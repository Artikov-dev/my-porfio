import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

let isConnected = false;

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('localhost') ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 4000,
  idleTimeoutMillis: 10000,
  max: 10,
});

pool.on('error', (err: Error) => {
  logger.error(`PostgreSQL pool error: ${err.message}`);
  isConnected = false;
  // Logged without crashing the process; the next query reconnects
});

export const db = {
  get isConnected() {
    return isConnected;
  },
  query: async (text: string, params?: any[]): Promise<QueryResult<any>> => {
    try {
      const res = await pool.query(text, params);
      isConnected = true;
      return res;
    } catch (err: any) {
      isConnected = false;
      throw err;
    }
  },
  getClient: () => pool.connect(),
};

// Test connection without throwing uncaught errors
export const connectDB = async () => {
  if (!connectionString) {
    logger.warn('⚠️ DATABASE_URL is not set. Running without a database.');
    return;
  }

  try {
    const client = await pool.connect();
    isConnected = true;
    logger.info('📦 Successfully connected to PostgreSQL database');
    client.release();
  } catch (error: any) {
    isConnected = false;
    logger.error(`❌ Failed to connect to PostgreSQL database: ${error?.message || error}`);
    logger.warn('⚠️ Server will continue without a database until it becomes reachable.');
  }
};

