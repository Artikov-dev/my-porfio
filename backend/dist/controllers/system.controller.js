"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemLogs = exports.getSystemHealth = void 0;
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getSystemHealth = async (req, res, next) => {
    try {
        const totalMem = os_1.default.totalmem();
        const freeMem = os_1.default.freemem();
        const usedMem = totalMem - freeMem;
        const cpuLoad = os_1.default.loadavg();
        res.status(200).json({
            success: true,
            data: {
                uptime: os_1.default.uptime(),
                memory: {
                    total: totalMem,
                    free: freeMem,
                    used: usedMem,
                    usagePercentage: ((usedMem / totalMem) * 100).toFixed(2),
                },
                cpu: {
                    cores: os_1.default.cpus().length,
                    model: os_1.default.cpus()[0]?.model,
                    loadAverage: cpuLoad,
                },
                platform: os_1.default.platform(),
                nodeVersion: process.version,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemHealth = getSystemHealth;
const getSystemLogs = async (req, res, next) => {
    try {
        const logsDir = path_1.default.join(__dirname, '../../logs');
        const type = req.query.type === 'error' ? 'error' : 'combined';
        let logsContent = '';
        if (fs_1.default.existsSync(logsDir)) {
            const files = fs_1.default.readdirSync(logsDir)
                .filter(f => f.startsWith(`${type}-`) && f.endsWith('.log'))
                .sort((a, b) => b.localeCompare(a)); // newest first
            if (files.length > 0) {
                const latestFile = path_1.default.join(logsDir, files[0]);
                const stats = fs_1.default.statSync(latestFile);
                const MAX_SIZE = 500 * 1024; // 500KB
                let start = 0;
                let readSize = stats.size;
                if (stats.size > MAX_SIZE) {
                    start = stats.size - MAX_SIZE;
                    readSize = MAX_SIZE;
                }
                if (readSize > 0) {
                    const buffer = Buffer.alloc(readSize);
                    const fd = fs_1.default.openSync(latestFile, 'r');
                    fs_1.default.readSync(fd, buffer, 0, buffer.length, start);
                    fs_1.default.closeSync(fd);
                    logsContent = buffer.toString('utf8');
                    if (start > 0) {
                        const firstNewline = logsContent.indexOf('\n');
                        if (firstNewline !== -1) {
                            logsContent = logsContent.substring(firstNewline + 1);
                        }
                    }
                }
            }
            else {
                logsContent = 'No logs found.';
            }
        }
        else {
            logsContent = 'Logs directory does not exist.';
        }
        res.status(200).json({
            success: true,
            data: {
                logs: logsContent.split('\n').filter(Boolean).slice(-300) // Return last 300 lines
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemLogs = getSystemLogs;
