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
exports.listAuditLogs = listAuditLogs;
exports.getAuditLog = getAuditLog;
exports.logEvent = logEvent;
const auditLogService = __importStar(require("../services/auditLogService"));
const AppError_1 = require("../utils/AppError");
const VALID_ACTIONS = [
    'USER_CREATED',
    'USER_ROLE_CHANGED',
    'CUSTOMER_CREATED',
    'APPROVAL_APPROVED',
    'APPROVAL_REJECTED',
    'REPORT_GENERATED',
    'REPORT_DOWNLOADED',
];
const VALID_MODULES = ['USERS', 'CUSTOMERS', 'APPROVALS', 'REPORTS'];
function parseAuditLogInput(body) {
    const { action, module, target, description, previousValue, newValue } = (body ?? {});
    if (!action || !VALID_ACTIONS.includes(action)) {
        throw new AppError_1.AppError(`"action" must be one of: ${VALID_ACTIONS.join(', ')}`, 400);
    }
    if (!module || !VALID_MODULES.includes(module)) {
        throw new AppError_1.AppError(`"module" must be one of: ${VALID_MODULES.join(', ')}`, 400);
    }
    if (!target) {
        throw new AppError_1.AppError('"target" is required', 400);
    }
    return { action, module, target, description, previousValue, newValue };
}
async function listAuditLogs(_req, res, next) {
    try {
        res.status(200).json(await auditLogService.listAuditLogs());
    }
    catch (err) {
        next(err);
    }
}
async function getAuditLog(req, res, next) {
    try {
        res.status(200).json(await auditLogService.getAuditLog(req.params.id));
    }
    catch (err) {
        next(err);
    }
}
async function logEvent(req, res, next) {
    try {
        const input = parseAuditLogInput(req.body);
        res.status(201).json(await auditLogService.logEvent(input, req.user.id));
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auditLogController.js.map