import * as auditLogRepository from '../repositories/auditLogRepository';
import type { AuditLogEntry, AuditLogInput } from '../models/AuditLog';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export async function listAuditLogs(): Promise<AuditLogEntry[]> {
  return auditLogRepository.findAll();
}

export async function getAuditLog(id: string): Promise<AuditLogEntry> {
  const entry = await auditLogRepository.findById(id);
  if (!entry) {
    throw new AppError(`Audit log "${id}" was not found`, 404);
  }
  return entry;
}

export async function logEvent(input: AuditLogInput, actorId: string): Promise<AuditLogEntry> {
  return auditLogRepository.create(input, actorId);
}

// Best-effort write for other services to call after a real mutation. Never
// throws — a broken audit insert must not roll back or fail the action it's
// describing, and a missing actor (no session on the request) just means
// there's nothing meaningful to attribute the event to, so it's skipped.
export function record(input: AuditLogInput, actorId: string | undefined): void {
  if (!actorId) {
    return;
  }
  auditLogRepository.create(input, actorId).catch((err) => {
    logger.error(`Failed to write audit log for ${input.action}`, err);
  });
}
