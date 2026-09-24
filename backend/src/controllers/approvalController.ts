import type { NextFunction, Request, Response } from 'express';
import * as approvalService from '../services/approvalService';
import type { ApprovalRequestInput, ApprovalType } from '../models/Approval';
import { AppError } from '../utils/AppError';

const VALID_TYPES: ApprovalType[] = ['PURCHASE', 'ACCESS', 'CUSTOMER_CHANGE', 'PROJECT', 'OTHER'];

function parseApprovalInput(body: unknown): ApprovalRequestInput {
  const { title, description, type, amount } = (body ?? {}) as Partial<ApprovalRequestInput>;

  if (!title) {
    throw new AppError('"title" is required', 400);
  }
  if (!description) {
    throw new AppError('"description" is required', 400);
  }
  if (!type || !VALID_TYPES.includes(type)) {
    throw new AppError(`"type" must be one of: ${VALID_TYPES.join(', ')}`, 400);
  }

  return { title, description, type, amount };
}

export async function listApprovals(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await approvalService.listApprovals());
  } catch (err) {
    next(err);
  }
}

export async function getApproval(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await approvalService.getApproval(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function createApprovalRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = parseApprovalInput(req.body);
    res.status(201).json(await approvalService.createApprovalRequest(input, req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function approveApproval(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { comment } = (req.body ?? {}) as { comment?: string };
    res.status(200).json(await approvalService.approveApproval(req.params.id, comment, req.user?.id));
  } catch (err) {
    next(err);
  }
}

export async function rejectApproval(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { comment } = (req.body ?? {}) as { comment?: string };
    res.status(200).json(await approvalService.rejectApproval(req.params.id, comment, req.user?.id));
  } catch (err) {
    next(err);
  }
}
