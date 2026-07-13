import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import xss from 'xss';

// Custom XSS filter that allows some safe tags if needed, or strips completely
const sanitizeString = (str: string) => {
  return xss(str, {
    whiteList: {
      b: [], i: [], u: [], strong: [], em: [], p: [], br: [],
      h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
      ul: [], ol: [], li: [], a: ['href', 'title', 'target'],
      img: ['src', 'alt', 'width', 'height'],
      span: ['style'], div: ['style'],
      pre: [], code: [], blockquote: []
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'iframe'] // Completely remove script and iframe tags
  });
};

const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = sanitizeObject(obj[key]);
    }
    return newObj;
  }
  return obj;
};

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the incoming request body
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // If valid, sanitize the body before passing to controller
      if (req.body) {
        req.body = sanitizeObject(req.body);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
        });
      }
      next(error);
    }
  };
};
