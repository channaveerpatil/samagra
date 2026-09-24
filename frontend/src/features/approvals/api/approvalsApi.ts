import { apiClient } from '@/lib/apiClient';
import { appConfig } from '@/config/appConfig';
import {
  APPROVAL_REVIEWER_GROUP,
  type ApprovalRequest,
  type ApprovalRequestInput,
  type UserReference,
} from '../types';

export interface ApprovalsApi {
  getApprovals: () => Promise<ApprovalRequest[]>;
  getApproval: (id: string) => Promise<ApprovalRequest | undefined>;
  createApprovalRequest: (
    input: ApprovalRequestInput,
    requestedBy: UserReference,
  ) => Promise<ApprovalRequest>;
  approveApproval: (id: string, comment?: string) => Promise<ApprovalRequest>;
  rejectApproval: (id: string, comment?: string) => Promise<ApprovalRequest>;
}

export const approvalsQueryKeys = {
  all: ['approvals'] as const,
  lists: () => [...approvalsQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...approvalsQueryKeys.all, 'detail', id] as const,
};

// ---------------------------------------------------------------------------
// Mock implementation (in-memory). Used while the real backend endpoints
// below don't exist yet — switch VITE_USE_MOCK_API to false once they do.
// ---------------------------------------------------------------------------

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: 'apr_001',
    title: 'Laptop Purchase Request',
    description: 'Request for a development laptop.',
    type: 'PURCHASE',
    requestedBy: { id: 'usr_john', name: 'John' },
    approver: { id: 'usr_sarah', name: 'Sarah' },
    amount: 85000,
    status: 'PENDING',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  },
  {
    id: 'apr_002',
    title: 'Database Access Request',
    description: 'Requesting read access to the production analytics database.',
    type: 'ACCESS',
    requestedBy: { id: 'usr_mike', name: 'Mike' },
    approver: { id: 'usr_sarah', name: 'Sarah' },
    status: 'PENDING',
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
  },
  {
    id: 'apr_003',
    title: 'Customer Change Request',
    description: 'Update billing contact for Northgate Trading Co.',
    type: 'CUSTOMER_CHANGE',
    requestedBy: { id: 'usr_john', name: 'John' },
    approver: { id: 'usr_sarah', name: 'Sarah' },
    status: 'APPROVED',
    comment: 'Approved for this quarter.',
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(28),
  },
  {
    id: 'apr_004',
    title: 'New Project Kickoff',
    description: 'Approval to start the Q3 mobile app redesign project.',
    type: 'PROJECT',
    requestedBy: { id: 'usr_mike', name: 'Mike' },
    approver: { id: 'usr_sarah', name: 'Sarah' },
    amount: 250000,
    status: 'REJECTED',
    comment: 'Budget is not available this quarter.',
    createdAt: hoursAgo(50),
    updatedAt: hoursAgo(48),
  },
  {
    id: 'apr_005',
    title: 'Conference Travel Request',
    description: 'Travel and accommodation for an industry conference.',
    type: 'OTHER',
    requestedBy: { id: 'usr_john', name: 'John' },
    approver: { id: 'usr_sarah', name: 'Sarah' },
    amount: 42000,
    status: 'PENDING',
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(1),
  },
  {
    id: 'apr_006',
    title: 'Office Software License',
    description: 'Annual renewal for design team software licenses.',
    type: 'PURCHASE',
    requestedBy: { id: 'usr_mike', name: 'Mike' },
    approver: { id: 'usr_sarah', name: 'Sarah' },
    amount: 18000,
    status: 'APPROVED',
    comment: 'Approved, standard renewal.',
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(70),
  },
];

const SIMULATED_LATENCY_MS = 400;

let approvals: ApprovalRequest[] = MOCK_APPROVALS.map((approval) => ({ ...approval }));

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

function decide(id: string, status: 'APPROVED' | 'REJECTED', comment?: string): ApprovalRequest {
  const index = approvals.findIndex((approval) => approval.id === id);
  if (index === -1) {
    throw new Error(`Approval "${id}" was not found`);
  }

  const current = approvals[index];
  if (current.status !== 'PENDING') {
    throw new Error(`Approval "${id}" has already been decided`);
  }

  const updated: ApprovalRequest = {
    ...current,
    status,
    comment,
    updatedAt: new Date().toISOString(),
  };
  approvals = approvals.map((approval) => (approval.id === id ? updated : approval));
  return updated;
}

const mockApprovalsApi: ApprovalsApi = {
  async getApprovals() {
    return delay(approvals.map((approval) => ({ ...approval })));
  },

  async getApproval(id) {
    const found = approvals.find((approval) => approval.id === id);
    return delay(found ? { ...found } : undefined);
  },

  async createApprovalRequest(input, requestedBy) {
    const now = new Date().toISOString();
    const created: ApprovalRequest = {
      id: `apr_${Math.random().toString(36).slice(2, 10)}`,
      title: input.title,
      description: input.description,
      type: input.type,
      amount: input.amount,
      requestedBy,
      approver: APPROVAL_REVIEWER_GROUP,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };
    approvals = [created, ...approvals];
    return delay({ ...created });
  },

  async approveApproval(id, comment) {
    return delay({ ...decide(id, 'APPROVED', comment) });
  },

  async rejectApproval(id, comment) {
    return delay({ ...decide(id, 'REJECTED', comment) });
  },
};

// ---------------------------------------------------------------------------
// Real implementation. Placeholder until the backend exposes these routes —
// no other code needs to change once it does; only VITE_USE_MOCK_API flips.
// ---------------------------------------------------------------------------

const BASE_PATH = '/approvals';

const realApprovalsApi: ApprovalsApi = {
  getApprovals() {
    return apiClient.get<ApprovalRequest[]>(BASE_PATH);
  },

  getApproval(id) {
    return apiClient.get<ApprovalRequest>(`${BASE_PATH}/${id}`);
  },

  createApprovalRequest(input, requestedBy) {
    return apiClient.post<ApprovalRequest>(BASE_PATH, { ...input, requestedBy });
  },

  approveApproval(id, comment) {
    return apiClient.post<ApprovalRequest>(`${BASE_PATH}/${id}/approve`, { comment });
  },

  rejectApproval(id, comment) {
    return apiClient.post<ApprovalRequest>(`${BASE_PATH}/${id}/reject`, { comment });
  },
};

export const approvalsApi: ApprovalsApi = appConfig.features.useMockApprovalsApi
  ? mockApprovalsApi
  : realApprovalsApi;
