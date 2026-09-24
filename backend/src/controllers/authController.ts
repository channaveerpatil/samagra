import type { NextFunction, Request, Response } from 'express';
import * as authService from '../services/authService';
import { config } from '../config/env';
import { buildClearCookie, buildSetCookie, parseCookies } from '../utils/cookies';
import { AppError } from '../utils/AppError';

function setSessionCookie(res: Response, sessionId: string): void {
  res.setHeader(
    'Set-Cookie',
    buildSetCookie(config.sessionCookieName, sessionId, {
      maxAgeMs: config.sessionTtlMs,
      secure: config.nodeEnv === 'production',
    }),
  );
}

function clearSessionCookie(res: Response): void {
  res.setHeader(
    'Set-Cookie',
    buildClearCookie(config.sessionCookieName, { secure: config.nodeEnv === 'production' }),
  );
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
    if (!email || !password) {
      throw new AppError('"email" and "password" are required', 400);
    }

    const { user, session } = await authService.login(email, password);
    setSessionCookie(res, session.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { firstName, lastName, email, password, company } = (req.body ?? {}) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      company?: string;
    };
    if (!firstName || !lastName || !email || !password) {
      throw new AppError('"firstName", "lastName", "email" and "password" are required', 400);
    }
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    const { user, session } = await authService.register({
      firstName,
      lastName,
      email,
      password,
      company,
    });
    setSessionCookie(res, session.id);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
    if (!email || !password) {
      throw new AppError('"email" and "password" are required', 400);
    }
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    await authService.resetPassword(email, password);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionId = parseCookies(req)[config.sessionCookieName];
    if (sessionId) {
      await authService.logout(sessionId);
    }
    clearSessionCookie(res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response): void {
  if (!req.user) {
    res.status(200).json(null);
    return;
  }
  res.status(200).json(req.user);
}
