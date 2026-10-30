"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruneOldVisits = exports.ensureSchema = void 0;
// The one place the database schema is defined. Every statement is idempotent
// (IF NOT EXISTS), so it runs on every server start and from `npm run db:init`.
// It never drops or deletes anything.
const STATEMENTS = [
    `CREATE TABLE IF NOT EXISTS projects (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title JSONB NOT NULL,
     description JSONB NOT NULL,
     content JSONB NOT NULL,
     image_url TEXT NOT NULL,
     github_url TEXT,
     live_url TEXT,
     tech_stack TEXT[] NOT NULL DEFAULT '{}',
     views INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   )`,
    `ALTER TABLE projects ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`,
    `CREATE TABLE IF NOT EXISTS blogs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title JSONB NOT NULL,
     content JSONB NOT NULL,
     image_url TEXT NOT NULL,
     tags TEXT[] NOT NULL DEFAULT '{}',
     reading_time INTEGER DEFAULT 1,
     views INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   )`,
    `ALTER TABLE blogs ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`,
    `CREATE TABLE IF NOT EXISTS contacts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     subject TEXT,
     body TEXT NOT NULL,
     location TEXT,
     ip_address TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   )`,
    `CREATE TABLE IF NOT EXISTS chat_messages (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     session_id TEXT NOT NULL,
     name TEXT NOT NULL,
     text TEXT NOT NULL,
     is_admin BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   )`,
    // ip_address holds a salted hash, never a raw IP (see analytics.service)
    `CREATE TABLE IF NOT EXISTS site_visits (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     ip_address TEXT,
     latitude DOUBLE PRECISION,
     longitude DOUBLE PRECISION,
     country TEXT,
     browser TEXT,
     os TEXT,
     device TEXT,
     path TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   )`,
    `ALTER TABLE site_visits
     ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
     ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`,
    `CREATE TABLE IF NOT EXISTS seo_settings (
     id INTEGER PRIMARY KEY DEFAULT 1,
     title JSONB NOT NULL,
     description JSONB NOT NULL,
     keywords TEXT[] NOT NULL DEFAULT '{}',
     og_image TEXT NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   )`,
    // The admin dashboard filters by date and the chat views by session; without these every
    // dashboard load scanned the whole table.
    `CREATE INDEX IF NOT EXISTS site_visits_created_at_idx ON site_visits (created_at)`,
    `CREATE INDEX IF NOT EXISTS site_visits_ip_address_idx ON site_visits (ip_address)`,
    `CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id, created_at)`,
    `CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages (created_at)`,
    `CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at)`,
];
const ensureSchema = async (query) => {
    for (const statement of STATEMENTS) {
        await query(statement);
    }
};
exports.ensureSchema = ensureSchema;
// Visit rows are only used for the 30-day charts and all-time counts; keeping them forever
// would slowly fill the free database tier. VISIT_RETENTION_DAYS=0 disables the cleanup.
const pruneOldVisits = async (query) => {
    const days = Number(process.env.VISIT_RETENTION_DAYS ?? 365);
    if (!Number.isFinite(days) || days <= 0)
        return 0;
    const result = await query(`DELETE FROM site_visits WHERE created_at < NOW() - make_interval(days => $1)`, [Math.floor(days)]);
    return result.rowCount ?? 0;
};
exports.pruneOldVisits = pruneOldVisits;
