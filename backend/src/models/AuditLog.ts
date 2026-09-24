export type AuditAction =
  | 'USER_CREATED'
  | 'USER_ROLE_CHANGED'
  | 'CUSTOMER_CREATED'
  | 'APPROVAL_APPROVED'
  | 'APPROVAL_REJECTED'
  | 'REPORT_GENERATED'
  | 'REPORT_DOWNLOADED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_DELETED';

export type AuditModule = 'USERS' | 'CUSTOMERS' | 'APPROVALS' | 'REPORTS' | 'DOCUMENTS';

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

export type AuditLogInput = Omit<AuditLogEntry, 'id' | 'createdAt' | 'actor'>;
