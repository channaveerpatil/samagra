"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const approvalController_1 = require("../controllers/approvalController");
const auth_1 = require("../middleware/auth");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// Mirrors the frontend's APPROVAL_VIEW/APPROVAL_CREATE permission (granted to
// everyone except VIEWER) and APPROVAL_APPROVE/APPROVAL_REJECT (SUPER_ADMIN/
// ADMIN/MANAGER only) — see frontend/src/lib/auth/rolePermissions.ts.
const canViewOrCreate = (0, requireRole_1.requireRole)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER');
const canDecide = (0, requireRole_1.requireRole)('SUPER_ADMIN', 'ADMIN', 'MANAGER');
router.get('/approvals', auth_1.requireAuth, canViewOrCreate, approvalController_1.listApprovals);
router.get('/approvals/:id', auth_1.requireAuth, canViewOrCreate, approvalController_1.getApproval);
router.post('/approvals', auth_1.requireAuth, canViewOrCreate, approvalController_1.createApprovalRequest);
router.post('/approvals/:id/approve', auth_1.requireAuth, canDecide, approvalController_1.approveApproval);
router.post('/approvals/:id/reject', auth_1.requireAuth, canDecide, approvalController_1.rejectApproval);
exports.default = router;
//# sourceMappingURL=approvalRoutes.js.map