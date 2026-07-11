"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env explicitly
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Render connections
});
const createTables = async () => {
    try {
        console.log('⏳ Connecting to Render PostgreSQL database...');
        const client = await pool.connect();
        console.log('✅ Connected. Creating tables...');
        // Projects Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title JSONB NOT NULL,
        description JSONB NOT NULL,
        content JSONB NOT NULL,
        image_url TEXT NOT NULL,
        github_url TEXT,
        live_url TEXT,
        tech_stack TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Projects table ensured.');
        // Blogs Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title JSONB NOT NULL,
        content JSONB NOT NULL,
        image_url TEXT NOT NULL,
        tags TEXT[] NOT NULL DEFAULT '{}',
        reading_time INTEGER DEFAULT 1,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Blogs table ensured.');
        // Contacts Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        body TEXT NOT NULL,
        location TEXT,
        ip_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Contacts table ensured.');
        // Chat Messages Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id TEXT NOT NULL,
        name TEXT NOT NULL,
        text TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Chat Messages table ensured.');
        client.release();
        console.log('🎉 Database initialization complete!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
};
createTables();
