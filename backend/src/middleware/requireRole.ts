import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import type { UserRole } from '../models/User';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError('You do not have permission to perform this action', 403));
      return;
    }
    next();
  };
}
