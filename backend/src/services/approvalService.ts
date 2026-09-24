import * as approvalRepository from '../repositories/approvalRepository';
import * as auditLogService from './auditLogService';
import * as notificationService from './notificationService';
import type { ApprovalRequest, ApprovalRequestInput } from '../models/Approval';
import { AppError } from '../utils/AppError';

export async function listApprovals(): Promise<ApprovalRequest[]> {
  return approvalRepository.findAll();
}

export async function getApproval(id: string): Promise<ApprovalRequest> {
  const approval = await approvalRepository.findById(id);
  if (!approval) {
    throw new AppError(`Approval "${id}" was not found`, 404);
  }
  return approval;
}

export async function createApprovalRequest(
  input: ApprovalRequestInput,
  requestedById: string,
): Promise<ApprovalRequest> {
  return approvalRepository.create(input, requestedById);
}

async function decide(
  id: string,
  status: 'APPROVED' | 'REJECTED',
  comment: string | undefined,
  actorId: string | undefined,
): Promise<ApprovalRequest> {
  const existing = await approvalRepository.findById(id);
  if (!existing) {
    throw new AppError(`Approval "${id}" was not found`, 404);
  }
  if (existing.status !== 'PENDING') {
    throw new AppError(`Approval "${id}" has already been decided`, 409);
  }

  const updated = await approvalRepository.decide(id, status, comment);
  if (!updated) {
    throw new AppError(`Approval "${id}" has already been decided`, 409);
  }

  auditLogService.record(
    {
      action: status === 'APPROVED' ? 'APPROVAL_APPROVED' : 'APPROVAL_REJECTED',
      module: 'APPROVALS',
      target: updated.title,
      description: `${status === 'APPROVED' ? 'Approved' : 'Rejected'} a pending ${updated.type.toLowerCase()} request.`,
      previousValue: 'status: PENDING',
      newValue: `status: ${status}`,
    },
    actorId,
  );

  // Notify the person who requested the approval, not the approver who just
  // acted — the frontend's own post-hoc notification create() call notifies
  // whoever is logged in (i.e. the approver), which is only correct in mock
  // mode where notifications aren't scoped to a specific user yet.
  notificationService.notify(
    {
      type: 'APPROVAL',
      title: 'Approval decision',
      message: `Your ${updated.title} was ${status === 'APPROVED' ? 'approved' : 'rejected'}.`,
    },
    updated.requestedBy.id,
  );

  return updated;
}

export async function approveApproval(
  id: string,
  comment: string | undefined,
  actorId?: string,
): Promise<ApprovalRequest> {
  return decide(id, 'APPROVED', comment, actorId);
}

export async function rejectApproval(
  id: string,
  comment: string | undefined,
  actorId?: string,
): Promise<ApprovalRequest> {
  return decide(id, 'REJECTED', comment, actorId);
}
