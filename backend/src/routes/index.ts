import { Router } from 'express';
import healthRoutes from './healthRoutes';
import customerRoutes from './customerRoutes';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import approvalRoutes from './approvalRoutes';
import auditLogRoutes from './auditLogRoutes';
import reportRoutes from './reportRoutes';
import notificationRoutes from './notificationRoutes';
import documentRoutes from './documentRoutes';

const router = Router();

router.use(healthRoutes);
router.use(customerRoutes);
router.use(userRoutes);
router.use(authRoutes);
router.use(approvalRoutes);
router.use(auditLogRoutes);
router.use(reportRoutes);
router.use(notificationRoutes);
router.use(documentRoutes);

export default router;
