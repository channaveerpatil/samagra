export type ApprovalType = 'PURCHASE' | 'ACCESS' | 'CUSTOMER_CHANGE' | 'PROJECT' | 'OTHER';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserReference {
  id: string;
  name: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  type: ApprovalType;
  requestedBy: UserReference;
  approver: UserReference;
  amount?: number;
  status: ApprovalStatus;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export const APPROVAL_TYPE_LABELS: Record<ApprovalType, string> = {
  PURCHASE: 'Purchase',
  ACCESS: 'Access',
  CUSTOMER_CHANGE: 'Customer Change',
  PROJECT: 'Project',
  OTHER: 'Other',
};

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export type ApprovalStatusFilter = 'ALL' | ApprovalStatus;

export type ApprovalTypeFilter = 'ALL' | ApprovalType;

// Shape of the react-router navigation `state` other pages (e.g. the
// Dashboard's approval breakdown chart) pass when deep-linking into the
// Approvals page pre-filtered to a status and/or a specific request.
export interface ApprovalsNavigationState {
  statusFilter?: ApprovalStatusFilter;
  approvalId?: string;
}

export interface ApprovalRequestInput {
  title: string;
  description: string;
  type: ApprovalType;
  amount?: number;
}

// Approval requests aren't routed to one specific person — any Super Admin,
// Admin or Manager (the roles holding APPROVAL_APPROVE/APPROVAL_REJECT) can
// act on a pending request, so newly created requests point at this shared
// reviewer-group placeholder rather than a single user.
export const APPROVAL_REVIEWER_GROUP: UserReference = {
  id: 'approval-reviewers',
  name: 'Super Admin / Admin / Manager',
};
