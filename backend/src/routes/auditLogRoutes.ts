import { Router } from 'express';
import { listAuditLogs, getAuditLog, logEvent } from '../controllers/auditLogController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// Mirrors the frontend's AUDIT_VIEW permission (SUPER_ADMIN/ADMIN/MANAGER only).
const canView = requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER');

router.get('/audit', requireAuth, canView, listAuditLogs);
router.get('/audit/:id', requireAuth, canView, getAuditLog);
router.post('/audit', requireAuth, logEvent);

export default router;
