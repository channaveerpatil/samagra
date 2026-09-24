import { Router } from 'express';
import {
  listNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  getPreferences,
  updatePreferences,
} from '../controllers/notificationController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/notifications', requireAuth, listNotifications);
router.get('/notifications/:id', requireAuth, getNotification);
router.post('/notifications', requireAuth, createNotification);
router.patch('/notifications/:id/read', requireAuth, markAsRead);
router.post('/notifications/read-all', requireAuth, markAllAsRead);
router.get('/notification-preferences', requireAuth, getPreferences);
router.patch('/notification-preferences', requireAuth, updatePreferences);

export default router;
