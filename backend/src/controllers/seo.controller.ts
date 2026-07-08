import { Request, Response } from 'express';
import { SEOService } from '../services/seo.service';

export const getSEOSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SEOService.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSEOSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SEOService.updateSettings(req.body);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
