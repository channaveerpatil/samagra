import { logger } from '@/lib/logger';
import { auditApi } from './api/auditApi';
import type { AuditLogInput } from './types';

// Fire-and-forget audit logging entry point for other features. Importing
// only the API layer (not hooks/components) keeps the rest of the app
// decoupled from the Audit UI — any feature can call auditService.log(...)
// without depending on TanStack Query cache state or the /audit page.
export const auditService = {
  async log(entry: AuditLogInput): Promise<void> {
    try {
      await auditApi.logEvent(entry);
    } catch (error) {
      logger.error('[auditService] Failed to record audit event', error);
    }
  },
};
