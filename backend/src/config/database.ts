import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

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
  isConnected = false;
  // Log once without crashing the process
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
    console.warn('⚠️ DATABASE_URL is not set. Running in fallback memory mode.');
    return;
  }

  try {
    const client = await pool.connect();
    isConnected = true;
    console.log('📦 Successfully connected to PostgreSQL database');
    client.release();
  } catch (error: any) {
    isConnected = false;
    console.error('❌ Failed to connect to PostgreSQL database:', error?.message || error);
    console.warn('⚠️ Server will continue in fallback mode. Note: Render Free PostgreSQL expires after 30-90 days.');
  }
};

