import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // body-parser errors (malformed JSON, body over the 1mb limit) carry a 4xx status and a
  // `type`; they are the client's fault, not a server crash
  const bodyParserError = err as Error & { status?: number; type?: string };

  if ('statusCode' in err && err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (bodyParserError.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON body';
  } else if (bodyParserError.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
  }

  logger.log(
    statusCode >= 500 ? 'error' : 'warn',
    `[${req.method}] ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${err.message}`,
  );

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
