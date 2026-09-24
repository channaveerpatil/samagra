"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// Mirrors the frontend's REPORT_VIEW (everyone, incl. VIEWER) vs
// REPORT_GENERATE/REPORT_DOWNLOAD (everyone except VIEWER) permissions.
const canGenerateOrDownload = (0, requireRole_1.requireRole)('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER');
// Static "jobs" path must be registered before the "/:id" param route so it
// isn't swallowed as an id.
router.get('/reports/jobs', auth_1.requireAuth, reportController_1.listReportJobs);
router.get('/reports', auth_1.requireAuth, reportController_1.listReportDefinitions);
router.get('/reports/:id', auth_1.requireAuth, reportController_1.getReportJob);
router.post('/reports', auth_1.requireAuth, canGenerateOrDownload, reportController_1.generateReport);
router.get('/reports/:id/download', auth_1.requireAuth, canGenerateOrDownload, reportController_1.downloadReport);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map