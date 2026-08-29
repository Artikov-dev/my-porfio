"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const pool = new pg_1.Pool({
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
    }
    catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    }
};
runMigration();
