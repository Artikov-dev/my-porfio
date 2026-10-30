"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const schema_1 = require("../config/schema");
// Load .env explicitly
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Creates any missing tables, columns and indexes. Safe to run any number of times:
// it never drops or deletes data. (The server also runs this on every start.)
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});
(0, schema_1.ensureSchema)((text, params) => pool.query(text, params))
    .then(() => console.log('🎉 Database schema is up to date.'))
    .catch((err) => {
    console.error('❌ Schema setup failed:', err);
    process.exitCode = 1;
})
    .finally(() => pool.end());
