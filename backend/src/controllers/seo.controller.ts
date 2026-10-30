import { Request, Response, NextFunction } from 'express';
import { SEOService } from '../services/seo.service';

export const getSEOSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await SEOService.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// Errors go to the global handler, so they are logged instead of disappearing
export const updateSEOSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await SEOService.updateSettings(req.body);
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
