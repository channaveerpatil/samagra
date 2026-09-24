"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditLogController_1 = require("../controllers/auditLogController");
const auth_1 = require("../middleware/auth");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// Mirrors the frontend's AUDIT_VIEW permission (SUPER_ADMIN/ADMIN/MANAGER only).
const canView = (0, requireRole_1.requireRole)('SUPER_ADMIN', 'ADMIN', 'MANAGER');
router.get('/audit', auth_1.requireAuth, canView, auditLogController_1.listAuditLogs);
router.get('/audit/:id', auth_1.requireAuth, canView, auditLogController_1.getAuditLog);
router.post('/audit', auth_1.requireAuth, auditLogController_1.logEvent);
exports.default = router;
//# sourceMappingURL=auditLogRoutes.js.map