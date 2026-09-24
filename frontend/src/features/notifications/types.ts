export type NotificationType = 'APPROVAL' | 'REPORT' | 'SECURITY' | 'SYSTEM';

export type NotificationActionType = 'DOWNLOAD_REPORT';

export interface NotificationMetadata {
  reportId?: string;
  downloadAvailable?: boolean;
}

export interface NotificationItem {
  id: string;
  // Only populated by the real backend, which scopes notifications per user;
  // absent in mock mode, which still keeps a single global list.
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionType?: NotificationActionType;
  metadata?: NotificationMetadata;
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  APPROVAL: 'Approval',
  REPORT: 'Report',
  SECURITY: 'Security',
  SYSTEM: 'System',
};

export interface NotificationPreferences {
  approvalRequests: boolean;
  reportNotifications: boolean;
  securityAlerts: boolean;
  systemNotifications: boolean;
}

export type NotificationPreferenceKey = keyof NotificationPreferences;

export type NotificationInput = Pick<NotificationItem, 'type' | 'title' | 'message'> &
  Partial<Pick<NotificationItem, 'actionType' | 'metadata'>>;
