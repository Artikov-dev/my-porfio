import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const data = await AnalyticsService.getDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};
