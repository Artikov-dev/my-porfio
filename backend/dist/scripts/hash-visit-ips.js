"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const geoip_lite_1 = __importDefault(require("geoip-lite"));
// Load .env explicitly
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Imported after dotenv so hashIp sees IP_HASH_SALT / JWT_SECRET
const analytics_service_1 = require("../services/analytics.service");
// One-off: replaces raw visitor IPs in site_visits with the same salted hash new visits use,
// saving the approximate coordinates first so the admin globe keeps working.
// Usage: npm run db:hash-ips
const HASH_PATTERN = /^[0-9a-f]{64}$/;
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});
const run = async () => {
    if (!process.env.IP_HASH_SALT && !process.env.JWT_SECRET) {
        throw new Error('Set IP_HASH_SALT (or JWT_SECRET) first — the hashes must match the running server.');
    }
    const client = await pool.connect();
    try {
        await client.query(`
      ALTER TABLE site_visits
        ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
        ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
    `);
        const { rows } = await client.query('SELECT DISTINCT ip_address FROM site_visits WHERE ip_address IS NOT NULL');
        const rawIps = rows.map((r) => r.ip_address).filter((ip) => !HASH_PATTERN.test(ip));
        console.log(`Found ${rawIps.length} raw IP address(es) to hash.`);
        await client.query('BEGIN');
        for (const ip of rawIps) {
            const geo = geoip_lite_1.default.lookup(ip);
            await client.query(`UPDATE site_visits
         SET ip_address = $1,
             latitude = COALESCE(latitude, $2),
             longitude = COALESCE(longitude, $3)
         WHERE ip_address = $4`, [(0, analytics_service_1.hashIp)(ip), geo?.ll?.[0] ?? null, geo?.ll?.[1] ?? null, ip]);
        }
        // Contact messages keep the sender IP for abuse handling, so they are left alone.
        await client.query('COMMIT');
        console.log('✅ Done.');
    }
    catch (err) {
        await client.query('ROLLBACK').catch(() => { });
        throw err;
    }
    finally {
        client.release();
        await pool.end();
    }
};
run().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
