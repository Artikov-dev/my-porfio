import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { ensureSchema } from '../config/schema';

// Load .env explicitly
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Creates any missing tables, columns and indexes. Safe to run any number of times:
// it never drops or deletes data. (The server also runs this on every start.)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});

ensureSchema((text, params) => pool.query(text, params))
  .then(() => console.log('🎉 Database schema is up to date.'))
  .catch((err) => {
    console.error('❌ Schema setup failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
