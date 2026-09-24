import type { NotificationInput, NotificationItem } from '../models/Notification';
import { pool } from '../db/pool';

function generateId(): string {
  return `ntf_${Math.random().toString(36).slice(2, 10)}`;
}

interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationItem['type'];
  title: string;
  message: string;
  action_type: NotificationItem['actionType'] | null;
  metadata: NotificationItem['metadata'] | null;
  is_read: boolean;
  created_at: Date;
}

function toNotificationItem(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    actionType: row.action_type ?? undefined,
    metadata: row.metadata ?? undefined,
    isRead: row.is_read,
    createdAt: row.created_at.toISOString(),
  };
}

const SELECT_COLUMNS =
  'id, user_id, type, title, message, action_type, metadata, is_read, created_at';

export async function findAllForUser(userId: string): Promise<NotificationItem[]> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
  return rows.map(toNotificationItem);
}

export async function findByIdForUser(
  id: string,
  userId: string,
): Promise<NotificationItem | undefined> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM notifications WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  return rows[0] ? toNotificationItem(rows[0]) : undefined;
}

export async function create(input: NotificationInput, userId: string): Promise<NotificationItem> {
  const id = generateId();
  const { rows } = await pool.query(
    `INSERT INTO notifications (id, user_id, type, title, message, action_type, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${SELECT_COLUMNS}`,
    [
      id,
      userId,
      input.type,
      input.title,
      input.message,
      input.actionType,
      input.metadata ? JSON.stringify(input.metadata) : null,
    ],
  );
  return toNotificationItem(rows[0]);
}

export async function markAsRead(
  id: string,
  userId: string,
): Promise<NotificationItem | undefined> {
  const { rows } = await pool.query(
    `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2
     RETURNING ${SELECT_COLUMNS}`,
    [id, userId],
  );
  return rows[0] ? toNotificationItem(rows[0]) : undefined;
}

export async function markAllAsRead(userId: string): Promise<NotificationItem[]> {
  const { rows } = await pool.query(
    `UPDATE notifications SET is_read = true WHERE user_id = $1
     RETURNING ${SELECT_COLUMNS}`,
    [userId],
  );
  return rows.map(toNotificationItem);
}
