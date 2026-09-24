import { env } from './env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface AppConfig {
  appName: string;
  api: {
    baseUrl: string;
    timeoutMs: number;
  };
  logging: {
    minLevel: LogLevel;
  };
  features: {
    useMockApi: boolean;
    useMockApprovalsApi: boolean;
    useMockAuditApi: boolean;
    useMockReportsApi: boolean;
    useMockNotificationsApi: boolean;
    notifications: boolean;
    approvals: boolean;
    reporting: boolean;
    audit: boolean;
  };
}

const minLogLevel: LogLevel = env.isDev ? 'debug' : 'warn';

export const appConfig: AppConfig = Object.freeze({
  appName: env.appName,
  api: {
    baseUrl: env.apiBaseUrl,
    timeoutMs: 15000,
  },
  logging: {
    minLevel: minLogLevel,
  },
  features: {
    useMockApi: env.useMockApi,
    useMockApprovalsApi: env.useMockApprovalsApi,
    useMockAuditApi: env.useMockAuditApi,
    useMockReportsApi: env.useMockReportsApi,
    useMockNotificationsApi: env.useMockNotificationsApi,
    notifications: env.featureNotifications,
    approvals: env.featureApprovals,
    reporting: env.featureReporting,
    audit: env.featureAudit,
  },
});
