import { Router } from 'express';
import {
  listApprovals,
  getApproval,
  createApprovalRequest,
  approveApproval,
  rejectApproval,
} from '../controllers/approvalController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// Mirrors the frontend's APPROVAL_VIEW/APPROVAL_CREATE permission (granted to
// everyone except VIEWER) and APPROVAL_APPROVE/APPROVAL_REJECT (SUPER_ADMIN/
// ADMIN/MANAGER only) — see frontend/src/lib/auth/rolePermissions.ts.
const canViewOrCreate = requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER');
const canDecide = requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER');

router.get('/approvals', requireAuth, canViewOrCreate, listApprovals);
router.get('/approvals/:id', requireAuth, canViewOrCreate, getApproval);
router.post('/approvals', requireAuth, canViewOrCreate, createApprovalRequest);
router.post('/approvals/:id/approve', requireAuth, canDecide, approveApproval);
router.post('/approvals/:id/reject', requireAuth, canDecide, rejectApproval);

export default router;
