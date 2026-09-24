import type { NextFunction, Request, Response } from 'express';
import { parseCookies } from '../utils/cookies';
import { config } from '../config/env';
import * as authService from '../services/authService';
import { AppError } from '../utils/AppError';
import type { User } from '../models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export async function attachUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionId = parseCookies(req)[config.sessionCookieName];
    if (sessionId) {
      req.user = await authService.getUserForSession(sessionId);
    }
    next();
  } catch (err) {
    next(err);
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new AppError('Authentication required', 401));
    return;
  }
  next();
}
