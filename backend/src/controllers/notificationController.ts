import type { NextFunction, Request, Response } from 'express';
import * as notificationService from '../services/notificationService';
import type { NotificationInput, NotificationType } from '../models/Notification';
import { AppError } from '../utils/AppError';

const VALID_TYPES: NotificationType[] = ['APPROVAL', 'REPORT', 'SECURITY', 'SYSTEM'];

function parseNotificationInput(body: unknown): NotificationInput {
  const { type, title, message, actionType, metadata } = (body ?? {}) as Partial<NotificationInput>;

  if (!type || !VALID_TYPES.includes(type)) {
    throw new AppError(`"type" must be one of: ${VALID_TYPES.join(', ')}`, 400);
  }
  if (!title) {
    throw new AppError('"title" is required', 400);
  }
  if (!message) {
    throw new AppError('"message" is required', 400);
  }

  return { type, title, message, actionType, metadata };
}

export async function listNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await notificationService.listNotifications(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function getNotification(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await notificationService.getNotification(req.params.id, req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function createNotification(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = parseNotificationInput(req.body);
    res.status(201).json(await notificationService.createNotification(input, req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await notificationService.markAsRead(req.params.id, req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await notificationService.markAllAsRead(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function getPreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await notificationService.getPreferences(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await notificationService.updatePreferences(req.user!.id, req.body ?? {}));
  } catch (err) {
    next(err);
  }
}
