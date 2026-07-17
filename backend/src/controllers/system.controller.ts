import { Request, Response, NextFunction } from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';

export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    const cpuLoad = os.loadavg();

    res.status(200).json({
      success: true,
      data: {
        uptime: os.uptime(),
        memory: {
          total: totalMem,
          free: freeMem,
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
