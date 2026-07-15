import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import UAParser from 'ua-parser-js';
import geoip from 'geoip-lite';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const data = await AnalyticsService.getDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Analytics Error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error fetching analytics' });
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const data = await AnalyticsService.getVisitorLocations();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get Locations Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching locations' });
  }
};

  export const recordVisit = async (req: Request, res: Response) => {
    try {
      const { path } = req.body;
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || '';
  
      // Parse User Agent
      const parser = new (UAParser as any)(userAgent);
      const browser = parser.getBrowser().name || 'Unknown';
      const os = parser.getOS().name || 'Unknown';
      const device = parser.getDevice().type || 'desktop';
  
      // Get Country from IP
      let country = 'Unknown';
    if (typeof ip === 'string') {
      const geo = geoip.lookup(ip.split(',')[0].trim());
      if (geo && geo.country) {
        country = geo.country;
      }
    }

    await AnalyticsService.recordVisit({
      ip_address: typeof ip === 'string' ? ip.split(',')[0].trim() : String(ip),
      country,
      browser,
      os,
      device,
      path: path || '/',
    });

    // Emit live location update to sockets
    if (typeof ip === 'string') {
      const geo = geoip.lookup(ip.split(',')[0].trim());
      if (geo && geo.ll) {
        const io = req.app.get('io');
        if (io) {
          io.emit('new_visitor_location', { lat: geo.ll[0], lng: geo.ll[1], country: geo.country });
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Record Visit Error:', error);
    res.status(200).json({ success: false });
  }
};
