"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotifications = listNotifications;
exports.getNotification = getNotification;
exports.createNotification = createNotification;
exports.notify = notify;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
exports.getPreferences = getPreferences;
exports.updatePreferences = updatePreferences;
const notificationRepository = __importStar(require("../repositories/notificationRepository"));
const notificationPreferenceRepository = __importStar(require("../repositories/notificationPreferenceRepository"));
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
async function listNotifications(userId) {
    return notificationRepository.findAllForUser(userId);
}
async function getNotification(id, userId) {
    const notification = await notificationRepository.findByIdForUser(id, userId);
    if (!notification) {
        throw new AppError_1.AppError(`Notification "${id}" was not found`, 404);
    }
    return notification;
}
async function createNotification(input, userId) {
    return notificationRepository.create(input, userId);
}
// Best-effort variant for other services to call after a real mutation
// (e.g. an approval decision notifying the original requester). Never
// throws — a broken notification insert must not block the action it's
// describing.
function notify(input, userId) {
    if (!userId) {
        return;
    }
    notificationRepository.create(input, userId).catch((err) => {
        logger_1.logger.error(`Failed to create notification "${input.title}"`, err);
    });
}
async function markAsRead(id, userId) {
    const updated = await notificationRepository.markAsRead(id, userId);
    if (!updated) {
        throw new AppError_1.AppError(`Notification "${id}" was not found`, 404);
    }
    return updated;
}
async function markAllAsRead(userId) {
    return notificationRepository.markAllAsRead(userId);
}
async function getPreferences(userId) {
    return notificationPreferenceRepository.findByUserId(userId);
}
async function updatePreferences(userId, updates) {
    return notificationPreferenceRepository.update(userId, updates);
}
//# sourceMappingURL=notificationService.js.map