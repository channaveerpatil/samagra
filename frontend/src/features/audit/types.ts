export type AuditAction =
  | 'USER_CREATED'
  | 'USER_ROLE_CHANGED'
  | 'CUSTOMER_CREATED'
  | 'APPROVAL_APPROVED'
  | 'APPROVAL_REJECTED'
  | 'REPORT_GENERATED'
  | 'REPORT_DOWNLOADED';

export type AuditModule = 'USERS' | 'CUSTOMERS' | 'APPROVALS' | 'REPORTS';

export interface AuditActor {
  id: string;
  name: string;
}

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  module: AuditModule;
  actor: AuditActor;
  target: string;
  description?: string;
  previousValue?: string;
  newValue?: string;
  createdAt: string;
}

export type AuditLogInput = Omit<AuditLogEntry, 'id' | 'createdAt'>;

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  USER_CREATED: 'User created',
  USER_ROLE_CHANGED: 'User role changed',
  CUSTOMER_CREATED: 'Customer created',
  APPROVAL_APPROVED: 'Approval approved',
  APPROVAL_REJECTED: 'Approval rejected',
  REPORT_GENERATED: 'Report generated',
  REPORT_DOWNLOADED: 'Report downloaded',
};

export const AUDIT_MODULE_LABELS: Record<AuditModule, string> = {
  USERS: 'Users',
  CUSTOMERS: 'Customers',
  APPROVALS: 'Approvals',
  REPORTS: 'Reports',
};

export type AuditActionFilter = 'ALL' | AuditAction;
export type AuditModuleFilter = 'ALL' | AuditModule;
export type AuditActorFilter = 'ALL' | string;
export type AuditDateFilter = 'ALL' | '24H' | '7D' | '30D';
