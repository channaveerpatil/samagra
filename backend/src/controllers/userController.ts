import type { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService';
import type { UserInput, UserProfileUpdate, UserRole } from '../models/User';
import { AppError } from '../utils/AppError';

const VALID_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'VIEWER'];

function parseUserInput(body: unknown): UserInput {
  const { firstName, lastName, email, role, phone, company, website } = (body ?? {}) as Partial<UserInput>;

  if (!firstName) {
    throw new AppError('"firstName" is required', 400);
  }
  if (!lastName) {
    throw new AppError('"lastName" is required', 400);
  }
  if (!email) {
    throw new AppError('"email" is required', 400);
  }
  if (!role || !VALID_ROLES.includes(role)) {
    throw new AppError('"role" must be one of: SUPER_ADMIN, ADMIN, MANAGER, USER, VIEWER', 400);
  }

  return { firstName, lastName, email, role, phone, company, website };
}

function parseProfileUpdate(body: unknown): UserProfileUpdate {
  const { firstName, lastName, phone, company, website } = (body ?? {}) as UserProfileUpdate;
  return { firstName, lastName, phone, company, website };
}

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await userService.listUsers());
  } catch (err) {
    next(err);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = parseUserInput(req.body);
    res.status(201).json(await userService.createUser(input, req.user?.id));
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = parseUserInput(req.body);
    res.status(200).json(await userService.updateUser(req.params.id, input, req.user?.id));
  } catch (err) {
    next(err);
  }
}

export async function updateOwnProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updates = parseProfileUpdate(req.body);
    res.status(200).json(await userService.updateOwnProfile(req.user!.id, updates));
  } catch (err) {
    next(err);
  }
}
