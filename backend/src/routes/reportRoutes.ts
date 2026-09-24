import { Router } from 'express';
import {
  listReportDefinitions,
  listReportJobs,
  getReportJob,
  generateReport,
  downloadReport,
} from '../controllers/reportController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// Mirrors the frontend's REPORT_VIEW (everyone, incl. VIEWER) vs
// REPORT_GENERATE/REPORT_DOWNLOAD (everyone except VIEWER) permissions.
const canGenerateOrDownload = requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER');

// Static "jobs" path must be registered before the "/:id" param route so it
// isn't swallowed as an id.
router.get('/reports/jobs', requireAuth, listReportJobs);
router.get('/reports', requireAuth, listReportDefinitions);
router.get('/reports/:id', requireAuth, getReportJob);
router.post('/reports', requireAuth, canGenerateOrDownload, generateReport);
router.get('/reports/:id/download', requireAuth, canGenerateOrDownload, downloadReport);

export default router;
