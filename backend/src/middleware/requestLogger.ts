import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs.toFixed(1)}ms`,
    );
  });

  next();
}
