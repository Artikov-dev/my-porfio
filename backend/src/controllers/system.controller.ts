import { Request, Response, NextFunction } from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';

// On Render the app runs in a container: os.totalmem()/os.uptime() describe the whole host
// machine, not this service. Use the cgroup memory limit when there is one.
const readContainerMemoryLimit = () => {
  for (const file of ['/sys/fs/cgroup/memory.max', '/sys/fs/cgroup/memory/memory.limit_in_bytes']) {
    try {
      const value = fs.readFileSync(file, 'utf8').trim();
      const bytes = Number(value);
      // 'max' or a huge sentinel value means "no limit"
      if (Number.isFinite(bytes) && bytes > 0 && bytes < os.totalmem()) return bytes;
    } catch {
      // not a cgroup container (e.g. local dev)
    }
  }
  return os.totalmem();
};

export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalMem = readContainerMemoryLimit();
    const usedMem = process.memoryUsage().rss;

    const cpuLoad = os.loadavg();

    res.status(200).json({
      success: true,
      data: {
        // This Node process, not the host
        uptime: process.uptime(),
        memory: {
          total: totalMem,
          free: Math.max(totalMem - usedMem, 0),
          used: usedMem,
          usagePercentage: ((usedMem / totalMem) * 100).toFixed(2),
        },
        cpu: {
          cores: os.cpus().length,
          model: os.cpus()[0]?.model,
          loadAverage: cpuLoad,
        },
        platform: os.platform(),
        nodeVersion: process.version,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logsDir = path.join(__dirname, '../../logs');
    const type = req.query.type === 'error' ? 'error' : 'combined';
    
    let logsContent = '';
    
    if (fs.existsSync(logsDir)) {
      const files = fs.readdirSync(logsDir)
        .filter(f => f.startsWith(`${type}-`) && f.endsWith('.log'))
        .sort((a, b) => b.localeCompare(a)); // newest first

      if (files.length > 0) {
        const latestFile = path.join(logsDir, files[0]);
        const stats = fs.statSync(latestFile);
        const MAX_SIZE = 500 * 1024; // 500KB
        
        let start = 0;
        let readSize = stats.size;
        
        if (stats.size > MAX_SIZE) {
          start = stats.size - MAX_SIZE;
          readSize = MAX_SIZE;
        }

        if (readSize > 0) {
          const buffer = Buffer.alloc(readSize);
          const fd = fs.openSync(latestFile, 'r');
          fs.readSync(fd, buffer, 0, buffer.length, start);
          fs.closeSync(fd);
          
          logsContent = buffer.toString('utf8');
          
          if (start > 0) {
            const firstNewline = logsContent.indexOf('\n');
            if (firstNewline !== -1) {
               logsContent = logsContent.substring(firstNewline + 1);
            }
          }
        }
      } else {
        logsContent = 'No logs found.';
      }
    } else {
      logsContent = 'Logs directory does not exist.';
    }

    res.status(200).json({
      success: true,
      data: {
        logs: logsContent.split('\n').filter(Boolean).slice(-300) // Return last 300 lines
      }
    });
  } catch (error) {
    next(error);
  }
};

// Diagnostic for the TRUST_PROXY setting: compare `ip` with your real public IP. If it shows a
// proxy/CDN address instead, raise TRUST_PROXY by one.
export const getClientIp = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      ip: req.ip,
      forwardedFor: req.headers['x-forwarded-for'] ?? null,
      trustProxy: req.app.get('trust proxy'),
    },
  });
};
