import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';

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

    const { text, from } = req.body;
    if (!text || !from) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Missing text or from language' });
    }

    const targetLangs = ['en', 'ru', 'uz'].filter((l) => l !== from);
    const results: Record<string, string> = { [from]: text };

    for (const target of targetLangs) {
      // translate requires 'uz' or 'ru' or 'en'
      let translated = await translate(text, { from, to: target });
      results[target] = translated;
    }

    res.status(200).json({ status: 'success', data: results });
  } catch (error) {
    console.error('Translation error:', error);
    next(error);
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
