"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Render requires SSL even in dev from local
});
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
exports.db = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
};
// Test connection
const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('📦 Successfully connected to PostgreSQL database');
        client.release();
    }
    catch (error) {
        console.error('❌ Failed to connect to PostgreSQL database:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
