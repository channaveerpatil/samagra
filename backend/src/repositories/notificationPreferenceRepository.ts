import type { NotificationPreferences, NotificationPreferencesUpdate } from '../models/Notification';
import { pool } from '../db/pool';

interface PreferencesRow {
  approval_requests: boolean;
  report_notifications: boolean;
  security_alerts: boolean;
  system_notifications: boolean;
}

function toPreferences(row: PreferencesRow): NotificationPreferences {
  return {
    approvalRequests: row.approval_requests,
    reportNotifications: row.report_notifications,
    securityAlerts: row.security_alerts,
    systemNotifications: row.system_notifications,
  };
}

const SELECT_COLUMNS =
  'approval_requests, report_notifications, security_alerts, system_notifications';

export async function findByUserId(userId: string): Promise<NotificationPreferences> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM notification_preferences WHERE user_id = $1`,
    [userId],
  );
  if (rows[0]) {
    return toPreferences(rows[0]);
  }

  const { rows: created } = await pool.query(
    `INSERT INTO notification_preferences (user_id) VALUES ($1)
     RETURNING ${SELECT_COLUMNS}`,
    [userId],
  );
  return toPreferences(created[0]);
}

export async function update(
  userId: string,
  updates: NotificationPreferencesUpdate,
): Promise<NotificationPreferences> {
  const current = await findByUserId(userId);
  const merged: NotificationPreferences = { ...current, ...updates };

  const { rows } = await pool.query(
    `INSERT INTO notification_preferences (user_id, approval_requests, report_notifications, security_alerts, system_notifications)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET
       approval_requests = $2, report_notifications = $3, security_alerts = $4, system_notifications = $5
     RETURNING ${SELECT_COLUMNS}`,
    [
      userId,
      merged.approvalRequests,
      merged.reportNotifications,
      merged.securityAlerts,
      merged.systemNotifications,
    ],
  );
  return toPreferences(rows[0]);
}
