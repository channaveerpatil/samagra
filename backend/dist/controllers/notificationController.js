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
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
exports.getPreferences = getPreferences;
exports.updatePreferences = updatePreferences;
const notificationService = __importStar(require("../services/notificationService"));
const AppError_1 = require("../utils/AppError");
const VALID_TYPES = ['APPROVAL', 'REPORT', 'SECURITY', 'SYSTEM'];
function parseNotificationInput(body) {
    const { type, title, message, actionType, metadata } = (body ?? {});
    if (!type || !VALID_TYPES.includes(type)) {
        throw new AppError_1.AppError(`"type" must be one of: ${VALID_TYPES.join(', ')}`, 400);
    }
    if (!title) {
        throw new AppError_1.AppError('"title" is required', 400);
    }
    if (!message) {
        throw new AppError_1.AppError('"message" is required', 400);
    }
    return { type, title, message, actionType, metadata };
}
async function listNotifications(req, res, next) {
    try {
        res.status(200).json(await notificationService.listNotifications(req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function getNotification(req, res, next) {
    try {
        res.status(200).json(await notificationService.getNotification(req.params.id, req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function createNotification(req, res, next) {
    try {
        const input = parseNotificationInput(req.body);
        res.status(201).json(await notificationService.createNotification(input, req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function markAsRead(req, res, next) {
    try {
        res.status(200).json(await notificationService.markAsRead(req.params.id, req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function markAllAsRead(req, res, next) {
    try {
        res.status(200).json(await notificationService.markAllAsRead(req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function getPreferences(req, res, next) {
    try {
        res.status(200).json(await notificationService.getPreferences(req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function updatePreferences(req, res, next) {
    try {
        res.status(200).json(await notificationService.updatePreferences(req.user.id, req.body ?? {}));
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=notificationController.js.map