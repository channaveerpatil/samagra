import { apiClient } from '@/lib/apiClient';
import { appConfig } from '@/config/appConfig';
import type { AuditLogEntry, AuditLogInput } from '../types';

export interface AuditApi {
  getAuditLogs: () => Promise<AuditLogEntry[]>;
  getAuditLog: (id: string) => Promise<AuditLogEntry | undefined>;
  logEvent: (input: AuditLogInput) => Promise<AuditLogEntry>;
}

export const auditQueryKeys = {
  all: ['audit'] as const,
  lists: () => [...auditQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...auditQueryKeys.all, 'detail', id] as const,
};

// ---------------------------------------------------------------------------
// Mock implementation (in-memory). Used while the real backend endpoints
// below don't exist yet — switch VITE_USE_MOCK_API to false once they do.
// ---------------------------------------------------------------------------

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_001',
    action: 'USER_CREATED',
    module: 'USERS',
    actor: { id: 'user-admin', name: 'Channaveer Patil' },
    target: 'Normal User (user@starterkit.dev)',
    description: 'Added a new user account with the USER role.',
    newValue: 'role: USER',
    createdAt: hoursAgo(1),
  },
  {
    id: 'aud_002',
    action: 'USER_ROLE_CHANGED',
    module: 'USERS',
    actor: { id: 'user-admin', name: 'Channaveer Patil' },
    target: 'Taylor Reyes (manager@starterkit.dev)',
    description: 'Promoted Taylor Reyes from USER to MANAGER.',
    previousValue: 'role: USER',
    newValue: 'role: MANAGER',
    createdAt: hoursAgo(4),
  },
  {
    id: 'aud_003',
    action: 'CUSTOMER_CREATED',
    module: 'CUSTOMERS',
    actor: { id: 'user-admin-2', name: 'Morgan Blake' },
    target: 'Northgate Trading Co.',
    description: 'Created a new customer record.',
    newValue: 'status: ACTIVE',
    createdAt: hoursAgo(6),
  },
  {
    id: 'aud_004',
    action: 'APPROVAL_APPROVED',
    module: 'APPROVALS',
    actor: { id: 'user-manager', name: 'Taylor Reyes' },
    target: 'Laptop Purchase Request',
    description: 'Approved a pending purchase request.',
    previousValue: 'status: PENDING',
    newValue: 'status: APPROVED',
    createdAt: hoursAgo(10),
  },
  {
    id: 'aud_005',
    action: 'APPROVAL_REJECTED',
    module: 'APPROVALS',
    actor: { id: 'user-manager', name: 'Taylor Reyes' },
    target: 'New Project Kickoff',
    description: 'Rejected the project approval due to budget constraints.',
    previousValue: 'status: PENDING',
    newValue: 'status: REJECTED',
    createdAt: hoursAgo(28),
  },
  {
    id: 'aud_006',
    action: 'REPORT_GENERATED',
    module: 'REPORTS',
    actor: { id: 'user-normal', name: 'Normal User' },
    target: 'Monthly Sales Report — July',
    description: 'Generated a report for the July sales cycle.',
    createdAt: hoursAgo(30),
  },
  {
    id: 'aud_007',
    action: 'REPORT_DOWNLOADED',
    module: 'REPORTS',
    actor: { id: 'user-normal', name: 'Normal User' },
    target: 'Monthly Sales Report — July',
    description: 'Downloaded the generated report as a PDF.',
    createdAt: hoursAgo(29),
  },
  {
    id: 'aud_008',
    action: 'USER_CREATED',
    module: 'USERS',
    actor: { id: 'user-admin', name: 'Channaveer Patil' },
    target: 'Jamie Rivera (jamie.rivera@starterkit.dev)',
    description: 'Added a new user account with the VIEWER role.',
    newValue: 'role: VIEWER',
    createdAt: hoursAgo(50),
  },
  {
    id: 'aud_009',
    action: 'CUSTOMER_CREATED',
    module: 'CUSTOMERS',
    actor: { id: 'user-manager', name: 'Taylor Reyes' },
    target: 'Bluewave Logistics',
    description: 'Created a new customer record.',
    newValue: 'status: ACTIVE',
    createdAt: hoursAgo(72),
  },
  {
    id: 'aud_010',
    action: 'APPROVAL_APPROVED',
    module: 'APPROVALS',
    actor: { id: 'user-admin-2', name: 'Morgan Blake' },
    target: 'Office Software License',
    description: 'Approved the annual software license renewal.',
    previousValue: 'status: PENDING',
    newValue: 'status: APPROVED',
    createdAt: hoursAgo(96),
  },
  {
    id: 'aud_011',
    action: 'USER_ROLE_CHANGED',
    module: 'USERS',
    actor: { id: 'user-admin', name: 'Channaveer Patil' },
    target: 'Morgan Blake (admin2@starterkit.dev)',
    description: 'Granted Morgan Blake the ADMIN role.',
    previousValue: 'role: MANAGER',
    newValue: 'role: ADMIN',
    createdAt: hoursAgo(120),
  },
  {
    id: 'aud_012',
    action: 'REPORT_GENERATED',
    module: 'REPORTS',
    actor: { id: 'user-manager', name: 'Taylor Reyes' },
    target: 'Quarterly Approvals Summary',
    description: 'Generated a summary report of Q2 approval activity.',
    createdAt: hoursAgo(150),
  },
];

const SIMULATED_LATENCY_MS = 400;

let auditLogs: AuditLogEntry[] = MOCK_AUDIT_LOGS.map((entry) => ({ ...entry }));

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

const mockAuditApi: AuditApi = {
  async getAuditLogs() {
    const sorted = [...auditLogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return delay(sorted.map((entry) => ({ ...entry })));
  },

  async getAuditLog(id) {
    const found = auditLogs.find((entry) => entry.id === id);
    return delay(found ? { ...found } : undefined);
  },

  async logEvent(input) {
    const entry: AuditLogEntry = {
      ...input,
      id: `aud_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    };
    auditLogs = [entry, ...auditLogs];
    return delay({ ...entry });
  },
};

// ---------------------------------------------------------------------------
// Real implementation. Placeholder until the backend exposes these routes —
// no other code needs to change once it does; only VITE_USE_MOCK_API flips.
// ---------------------------------------------------------------------------

const BASE_PATH = '/audit';

const realAuditApi: AuditApi = {
  getAuditLogs() {
    return apiClient.get<AuditLogEntry[]>(BASE_PATH);
  },

  getAuditLog(id) {
    return apiClient.get<AuditLogEntry>(`${BASE_PATH}/${id}`);
  },

  logEvent(input) {
    return apiClient.post<AuditLogEntry>(BASE_PATH, input);
  },
};

export const auditApi: AuditApi = appConfig.features.useMockAuditApi ? mockAuditApi : realAuditApi;
