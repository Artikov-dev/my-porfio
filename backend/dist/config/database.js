"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./logger");
dotenv_1.default.config();
let isConnected = false;
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({
    connectionString,
    ssl: connectionString?.includes('localhost') ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 4000,
    idleTimeoutMillis: 10000,
    max: 10,
});
pool.on('error', (err) => {
    logger_1.logger.error(`PostgreSQL pool error: ${err.message}`);
    isConnected = false;
    // Logged without crashing the process; the next query reconnects
});
exports.db = {
    get isConnected() {
        return isConnected;
    },
    query: async (text, params) => {
        try {
            const res = await pool.query(text, params);
            isConnected = true;
            return res;
        }
        catch (err) {
            isConnected = false;
            throw err;
        }
    },
    getClient: () => pool.connect(),
};
// Test connection without throwing uncaught errors
const connectDB = async () => {
    if (!connectionString) {
        logger_1.logger.warn('⚠️ DATABASE_URL is not set. Running without a database.');
        return;
    }
    try {
        const client = await pool.connect();
        isConnected = true;
        logger_1.logger.info('📦 Successfully connected to PostgreSQL database');
        client.release();
    }
    catch (error) {
        isConnected = false;
        logger_1.logger.error(`❌ Failed to connect to PostgreSQL database: ${error?.message || error}`);
        logger_1.logger.warn('⚠️ Server will continue without a database until it becomes reachable.');
    }
};
exports.connectDB = connectDB;
