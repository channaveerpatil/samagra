"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/notifications', auth_1.requireAuth, notificationController_1.listNotifications);
router.get('/notifications/:id', auth_1.requireAuth, notificationController_1.getNotification);
router.post('/notifications', auth_1.requireAuth, notificationController_1.createNotification);
router.patch('/notifications/:id/read', auth_1.requireAuth, notificationController_1.markAsRead);
router.post('/notifications/read-all', auth_1.requireAuth, notificationController_1.markAllAsRead);
router.get('/notification-preferences', auth_1.requireAuth, notificationController_1.getPreferences);
router.patch('/notification-preferences', auth_1.requireAuth, notificationController_1.updatePreferences);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map