import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { CustomError } from '../middlewares/error.middleware';
import { logger } from '../config/logger';

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.status(200).json({ status: 'success', data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await ProjectService.getProjectById(
      req.params.id as string,
    );
    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await ProjectService.createProject(req.body);
    res.status(201).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await ProjectService.updateProject(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({ status: 'success', data: project });
  } catch (error) {
    next(error);
  }
};

export const autoTranslate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Dynamic import for ESM package in CommonJS
    const { default: translate } = await import('translate');
    translate.engine = 'google';

    // Validated by translateSchema: non-empty text, from ∈ en | uz | ru
    const { text, from } = req.body;

    const targetLangs = ['en', 'ru', 'uz'].filter((l) => l !== from);
    const translations = await Promise.all(
      targetLangs.map((to) => translate(text, { from, to })),
    );
    const results: Record<string, string> = { [from]: text };
    targetLangs.forEach((lang, i) => {
      results[lang] = translations[i];
    });

    res.status(200).json({ status: 'success', data: results });
  } catch (error) {
    logger.error(`Translation error: ${error}`);
    next(new CustomError('Translation service failed, please try again', 502));
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await ProjectService.deleteProject(req.params.id as string);
    res
      .status(200)
      .json({ status: 'success', message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
