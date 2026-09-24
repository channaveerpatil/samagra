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
exports.record = record;
const auditLogRepository = __importStar(require("../repositories/auditLogRepository"));
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
async function listAuditLogs() {
    return auditLogRepository.findAll();
}
async function getAuditLog(id) {
    const entry = await auditLogRepository.findById(id);
    if (!entry) {
        throw new AppError_1.AppError(`Audit log "${id}" was not found`, 404);
    }
    return entry;
}
async function logEvent(input, actorId) {
    return auditLogRepository.create(input, actorId);
}
// Best-effort write for other services to call after a real mutation. Never
// throws — a broken audit insert must not roll back or fail the action it's
// describing, and a missing actor (no session on the request) just means
// there's nothing meaningful to attribute the event to, so it's skipped.
function record(input, actorId) {
    if (!actorId) {
        return;
    }
    auditLogRepository.create(input, actorId).catch((err) => {
        logger_1.logger.error(`Failed to write audit log for ${input.action}`, err);
    });
}
//# sourceMappingURL=auditLogService.js.map