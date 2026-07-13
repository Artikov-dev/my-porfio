import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const runMigration = async () => {
  try {
    const client = await pool.connect();
    console.log('⏳ Running Analytics Migration...');

    // 1. Add views column to projects if it doesn't exist
    await client.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
    `);
    console.log('✅ Added views column to projects.');

    // 2. Create site_visits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_visits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ip_address TEXT,
        country TEXT,
        browser TEXT,
        os TEXT,
        device TEXT,
        path TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created site_visits table.');

    client.release();
    console.log('🎉 Migration successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
};

runMigration();
