import { appConfig } from './appConfig';

export const featureFlags = {
  notifications: appConfig.features.notifications,
  approvals: appConfig.features.approvals,
  reporting: appConfig.features.reporting,
  audit: appConfig.features.audit,
} as const;
