import * as notificationRepository from '../repositories/notificationRepository';
import * as notificationPreferenceRepository from '../repositories/notificationPreferenceRepository';
import type {
  NotificationInput,
  NotificationItem,
  NotificationPreferences,
  NotificationPreferencesUpdate,
} from '../models/Notification';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export async function listNotifications(userId: string): Promise<NotificationItem[]> {
  return notificationRepository.findAllForUser(userId);
}

export async function getNotification(id: string, userId: string): Promise<NotificationItem> {
  const notification = await notificationRepository.findByIdForUser(id, userId);
  if (!notification) {
    throw new AppError(`Notification "${id}" was not found`, 404);
  }
  return notification;
}

export async function createNotification(
  input: NotificationInput,
  userId: string,
): Promise<NotificationItem> {
  return notificationRepository.create(input, userId);
}

// Best-effort variant for other services to call after a real mutation
// (e.g. an approval decision notifying the original requester). Never
// throws — a broken notification insert must not block the action it's
// describing.
export function notify(input: NotificationInput, userId: string | undefined): void {
  if (!userId) {
    return;
  }
  notificationRepository.create(input, userId).catch((err) => {
    logger.error(`Failed to create notification "${input.title}"`, err);
  });
}

export async function markAsRead(id: string, userId: string): Promise<NotificationItem> {
  const updated = await notificationRepository.markAsRead(id, userId);
  if (!updated) {
    throw new AppError(`Notification "${id}" was not found`, 404);
  }
  return updated;
}

export async function markAllAsRead(userId: string): Promise<NotificationItem[]> {
  return notificationRepository.markAllAsRead(userId);
}

export async function getPreferences(userId: string): Promise<NotificationPreferences> {
  return notificationPreferenceRepository.findByUserId(userId);
}

export async function updatePreferences(
  userId: string,
  updates: NotificationPreferencesUpdate,
): Promise<NotificationPreferences> {
  return notificationPreferenceRepository.update(userId, updates);
}
