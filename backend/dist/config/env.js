"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertRequiredEnv = void 0;
const logger_1 = require("./logger");
const MIN_SECRET_LENGTH = 32;
// Fail at boot instead of crashing on the first login request with "secretOrPrivateKey must have a value"
const assertRequiredEnv = () => {
    const problems = [];
    for (const name of ['JWT_SECRET', 'REFRESH_TOKEN_SECRET']) {
        const value = process.env[name];
        if (!value)
            problems.push(`${name} is not set`);
        else if (value.length < MIN_SECRET_LENGTH)
            problems.push(`${name} must be at least ${MIN_SECRET_LENGTH} characters`);
    }
    // With one shared secret an access token would also pass as a refresh token and vice versa
    if (process.env.JWT_SECRET && process.env.JWT_SECRET === process.env.REFRESH_TOKEN_SECRET) {
        problems.push('JWT_SECRET and REFRESH_TOKEN_SECRET must be different');
    }
    if (problems.length > 0) {
        throw new Error(`Invalid environment configuration:\n  - ${problems.join('\n  - ')}`);
    }
    if (!process.env.DATABASE_URL) {
        logger_1.logger.warn('⚠️ DATABASE_URL is not set — the API will run without a database.');
    }
};
exports.assertRequiredEnv = assertRequiredEnv;
