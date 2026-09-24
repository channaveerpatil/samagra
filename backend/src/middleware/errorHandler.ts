import type { NextFunction, Request, Response } from 'express';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // Express only treats a middleware as an error handler if it declares 4 parameters.
  _next: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Internal server error';

  logger.error(`${req.method} ${req.originalUrl} failed: ${message}`, err);

  res.status(statusCode).json({
    error: {
      message:
        statusCode === 500 && config.nodeEnv === 'production' ? 'Internal server error' : message,
    },
  });
}
