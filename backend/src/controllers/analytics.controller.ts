import { Request, Response } from 'express';
import { AnalyticsService, hashIp } from '../services/analytics.service';
import UAParser from 'ua-parser-js';
import geoip from 'geoip-lite';
import { ADMIN_ROOM } from '../config/socket';
import { logger } from '../config/logger';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const data = await AnalyticsService.getDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    logger.error(`Analytics error: ${error}`);
    res
      .status(500)
      .json({ success: false, message: 'Server error fetching analytics' });
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const data = await AnalyticsService.getVisitorLocations();
    res.json({ success: true, data });
  } catch (error) {
    logger.error(`Get locations error: ${error}`);
    res.status(500).json({ success: false, message: 'Server error fetching locations' });
  }
};

export const recordVisit = async (req: Request, res: Response) => {
  try {
    const { path } = req.body;
    // req.ip honours 'trust proxy' (only Render's proxy hop); the raw X-Forwarded-For header can be spoofed by clients
    const ip = (req.ip || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || '';

    // Parse User Agent
    const parser = new (UAParser as any)(userAgent);
    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';
    const device = parser.getDevice().type || 'desktop';

    const geo = geoip.lookup(ip);

    // Only a salted hash of the IP is stored (enough to count unique visitors), plus the
    // approximate city coordinates the globe needs — never the raw address.
    await AnalyticsService.recordVisit({
      ip_hash: hashIp(ip),
      latitude: geo?.ll?.[0] ?? null,
      longitude: geo?.ll?.[1] ?? null,
      country: geo?.country || 'Unknown',
      browser,
      os,
      device,
      path: typeof path === 'string' ? path.slice(0, 200) : '/',
    });

    // Live location update for the admin dashboard only — never broadcast visitor locations to everyone
    if (geo?.ll) {
      const io = req.app.get('io');
      if (io) {
        io.to(ADMIN_ROOM).emit('new_visitor_location', { lat: geo.ll[0], lng: geo.ll[1], country: geo.country });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`Record visit error: ${error}`);
    res.status(200).json({ success: false });
  }
};
