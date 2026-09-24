import type { NextFunction, Request, Response } from 'express';
import * as auditLogService from '../services/auditLogService';
import type { AuditAction, AuditLogInput, AuditModule } from '../models/AuditLog';
import { AppError } from '../utils/AppError';

const VALID_ACTIONS: AuditAction[] = [
  'USER_CREATED',
  'USER_ROLE_CHANGED',
  'CUSTOMER_CREATED',
  'APPROVAL_APPROVED',
  'APPROVAL_REJECTED',
  'REPORT_GENERATED',
  'REPORT_DOWNLOADED',
];

const VALID_MODULES: AuditModule[] = ['USERS', 'CUSTOMERS', 'APPROVALS', 'REPORTS'];

function parseAuditLogInput(body: unknown): AuditLogInput {
  const { action, module, target, description, previousValue, newValue } = (body ?? {}) as Partial<AuditLogInput>;

  if (!action || !VALID_ACTIONS.includes(action)) {
    throw new AppError(`"action" must be one of: ${VALID_ACTIONS.join(', ')}`, 400);
  }
  if (!module || !VALID_MODULES.includes(module)) {
    throw new AppError(`"module" must be one of: ${VALID_MODULES.join(', ')}`, 400);
  }
  if (!target) {
    throw new AppError('"target" is required', 400);
  }

  return { action, module, target, description, previousValue, newValue };
}

export async function listAuditLogs(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await auditLogService.listAuditLogs());
  } catch (err) {
    next(err);
  }
}

export async function getAuditLog(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await auditLogService.getAuditLog(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function logEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = parseAuditLogInput(req.body);
    res.status(201).json(await auditLogService.logEvent(input, req.user!.id));
  } catch (err) {
    next(err);
  }
}
