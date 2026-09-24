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

export type ApprovalRequestInput = {
  title: string;
  description: string;
  type: ApprovalType;
  amount?: number;
};

// Approval requests aren't routed to one specific person — any Super Admin,
// Admin or Manager can act on any pending request, so responses always point
// `approver` at this shared placeholder rather than a real user (mirrors the
// frontend's APPROVAL_REVIEWER_GROUP constant).
export const APPROVAL_REVIEWER_GROUP: UserReference = {
  id: 'approval-reviewers',
  name: 'Super Admin / Admin / Manager',
};
