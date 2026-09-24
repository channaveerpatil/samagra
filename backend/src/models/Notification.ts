export type NotificationType = 'APPROVAL' | 'REPORT' | 'SECURITY' | 'SYSTEM';

export type NotificationActionType = 'DOWNLOAD_REPORT';

export interface NotificationMetadata {
  reportId?: string;
  downloadAvailable?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionType?: NotificationActionType;
  metadata?: NotificationMetadata;
}

export type NotificationInput = Pick<NotificationItem, 'type' | 'title' | 'message'> &
  Partial<Pick<NotificationItem, 'actionType' | 'metadata'>>;

export interface NotificationPreferences {
  approvalRequests: boolean;
  reportNotifications: boolean;
  securityAlerts: boolean;
  systemNotifications: boolean;
}

export type NotificationPreferencesUpdate = Partial<NotificationPreferences>;
