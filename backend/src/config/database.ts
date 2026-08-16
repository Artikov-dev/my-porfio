import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Render requires SSL even in dev from local
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client:', err.message);
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};

// Test connection
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('📦 Successfully connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL database:', error);
    console.warn('⚠️ Server will continue without database connection. Some features may not work.');
    console.warn('⚠️ Check if your Render PostgreSQL database is still active (free tier expires after 90 days).');
  }
};
