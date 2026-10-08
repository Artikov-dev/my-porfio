"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Prints a bcrypt hash for ADMIN_PASSWORD_HASH.
// Usage: npm run hash-password -- "your-strong-password"
const bcrypt_1 = __importDefault(require("bcrypt"));
const password = process.argv[2];
if (!password || password.length < 12) {
    console.error('Usage: npm run hash-password -- "<password of at least 12 characters>"');
    process.exit(1);
}
console.log(bcrypt_1.default.hashSync(password, 12));
