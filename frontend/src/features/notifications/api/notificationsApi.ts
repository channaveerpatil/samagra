import { apiClient } from '@/lib/apiClient';
import { appConfig } from '@/config/appConfig';
import type { NotificationInput, NotificationItem, NotificationPreferences } from '../types';

export interface NotificationsApi {
  list: () => Promise<NotificationItem[]>;
  get: (id: string) => Promise<NotificationItem | undefined>;
  create: (input: NotificationInput) => Promise<NotificationItem>;
  markAsRead: (id: string) => Promise<NotificationItem>;
  markAllAsRead: () => Promise<NotificationItem[]>;
  getPreferences: () => Promise<NotificationPreferences>;
  updatePreferences: (
    preferences: Partial<NotificationPreferences>,
  ) => Promise<NotificationPreferences>;
}

export const notificationsQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationsQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...notificationsQueryKeys.all, 'detail', id] as const,
  preferences: () => [...notificationsQueryKeys.all, 'preferences'] as const,
};

// ---------------------------------------------------------------------------
// Mock implementation (in-memory). Used while the real backend endpoints
// below don't exist yet — switch VITE_USE_MOCK_API to false once they do.
// ---------------------------------------------------------------------------

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'ntf_001',
    type: 'APPROVAL',
    title: 'Approval required',
    message: 'Purchase request requires your approval',
    createdAt: minutesAgo(5),
    isRead: false,
  },
  {
    id: 'ntf_002',
    type: 'REPORT',
    title: 'Report ready',
    message: 'Monthly report is ready',
    createdAt: minutesAgo(20),
    isRead: false,
  },
  {
    id: 'ntf_003',
    type: 'SECURITY',
    title: 'Permissions updated',
    message: 'User permissions were updated',
    createdAt: minutesAgo(60),
    isRead: false,
  },
  {
    id: 'ntf_004',
    type: 'SYSTEM',
    title: 'Maintenance completed',
    message: 'Scheduled maintenance completed',
    createdAt: minutesAgo(180),
    isRead: true,
  },
  {
    id: 'ntf_005',
    type: 'REPORT',
    title: 'Report ready',
    message: 'Weekly sales report is ready',
    createdAt: minutesAgo(60 * 24),
    isRead: true,
  },
  {
    id: 'ntf_006',
    type: 'APPROVAL',
    title: 'Approval completed',
    message: 'Expense report approval was completed',
    createdAt: minutesAgo(60 * 30),
    isRead: true,
  },
];

const MOCK_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  approvalRequests: true,
  reportNotifications: true,
  securityAlerts: true,
  systemNotifications: false,
};

const SIMULATED_LATENCY_MS = 300;

let notifications: NotificationItem[] = MOCK_NOTIFICATIONS.map((notification) => ({
  ...notification,
}));
let preferences: NotificationPreferences = { ...MOCK_NOTIFICATION_PREFERENCES };

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

function generateId(): string {
  return `ntf_${Math.random().toString(36).slice(2, 10)}`;
}

const mockNotificationsApi: NotificationsApi = {
  async list() {
    return delay(notifications.map((notification) => ({ ...notification })));
  },

  async get(id) {
    const found = notifications.find((notification) => notification.id === id);
    return delay(found ? { ...found } : undefined);
  },

  async create(input) {
    const created: NotificationItem = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    notifications = [created, ...notifications];
    return delay({ ...created });
  },

  async markAsRead(id) {
    const index = notifications.findIndex((notification) => notification.id === id);
    if (index === -1) {
      throw new Error(`Notification "${id}" was not found`);
    }
    const updated: NotificationItem = { ...notifications[index], isRead: true };
    notifications = notifications.map((notification) =>
      notification.id === id ? updated : notification,
    );
    return delay({ ...updated });
  },

  async markAllAsRead() {
    notifications = notifications.map((notification) => ({ ...notification, isRead: true }));
    return delay(notifications.map((notification) => ({ ...notification })));
  },

  async getPreferences() {
    return delay({ ...preferences });
  },

  async updatePreferences(update) {
    preferences = { ...preferences, ...update };
    return delay({ ...preferences });
  },
};

// ---------------------------------------------------------------------------
// Real implementation. Placeholder until the backend exposes these routes —
// no other code needs to change once it does; only VITE_USE_MOCK_API flips.
// ---------------------------------------------------------------------------

const BASE_PATH = '/notifications';
const PREFERENCES_PATH = '/notification-preferences';

const realNotificationsApi: NotificationsApi = {
  list() {
    return apiClient.get<NotificationItem[]>(BASE_PATH);
  },

  get(id) {
    return apiClient.get<NotificationItem>(`${BASE_PATH}/${id}`);
  },

  create(input) {
    return apiClient.post<NotificationItem>(BASE_PATH, input);
  },

  markAsRead(id) {
    return apiClient.patch<NotificationItem>(`${BASE_PATH}/${id}/read`);
  },

  markAllAsRead() {
    return apiClient.post<NotificationItem[]>(`${BASE_PATH}/read-all`);
  },

  getPreferences() {
    return apiClient.get<NotificationPreferences>(PREFERENCES_PATH);
  },

  updatePreferences(preferences) {
    return apiClient.patch<NotificationPreferences>(PREFERENCES_PATH, preferences);
  },
};

export const notificationsApi: NotificationsApi = appConfig.features.useMockNotificationsApi
  ? mockNotificationsApi
  : realNotificationsApi;
