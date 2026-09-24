export interface EnvConfig {
  appName: string;
  apiBaseUrl: string;
  isDev: boolean;
  isProd: boolean;
  useMockApi: boolean;
  useMockApprovalsApi: boolean;
  useMockAuditApi: boolean;
  useMockReportsApi: boolean;
  useMockNotificationsApi: boolean;
  featureNotifications: boolean;
  featureApprovals: boolean;
  featureReporting: boolean;
  featureAudit: boolean;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === 'true';
}

const useMockApi = parseBoolean(import.meta.env.VITE_USE_MOCK_API, true);

export const env: EnvConfig = {
  appName: import.meta.env.VITE_APP_NAME,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  useMockApi,
  // Per-feature override so a phase (e.g. Approvals going real) can flip
  // independently of features that don't have a real backend yet. Falls
  // back to the global flag when unset.
  useMockApprovalsApi: parseBoolean(import.meta.env.VITE_USE_MOCK_APPROVALS_API, useMockApi),
  useMockAuditApi: parseBoolean(import.meta.env.VITE_USE_MOCK_AUDIT_API, useMockApi),
  useMockReportsApi: parseBoolean(import.meta.env.VITE_USE_MOCK_REPORTS_API, useMockApi),
  useMockNotificationsApi: parseBoolean(import.meta.env.VITE_USE_MOCK_NOTIFICATIONS_API, useMockApi),
  featureNotifications: parseBoolean(import.meta.env.VITE_FEATURE_NOTIFICATIONS, true),
  featureApprovals: parseBoolean(import.meta.env.VITE_FEATURE_APPROVALS, true),
  featureReporting: parseBoolean(import.meta.env.VITE_FEATURE_REPORTING, true),
  featureAudit: parseBoolean(import.meta.env.VITE_FEATURE_AUDIT, true),
};
