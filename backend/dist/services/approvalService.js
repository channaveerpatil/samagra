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
exports.listApprovals = listApprovals;
exports.getApproval = getApproval;
exports.createApprovalRequest = createApprovalRequest;
exports.approveApproval = approveApproval;
exports.rejectApproval = rejectApproval;
const approvalRepository = __importStar(require("../repositories/approvalRepository"));
const auditLogService = __importStar(require("./auditLogService"));
const notificationService = __importStar(require("./notificationService"));
const AppError_1 = require("../utils/AppError");
async function listApprovals() {
    return approvalRepository.findAll();
}
async function getApproval(id) {
    const approval = await approvalRepository.findById(id);
    if (!approval) {
        throw new AppError_1.AppError(`Approval "${id}" was not found`, 404);
    }
    return approval;
}
async function createApprovalRequest(input, requestedById) {
    return approvalRepository.create(input, requestedById);
}
async function decide(id, status, comment, actorId) {
    const existing = await approvalRepository.findById(id);
    if (!existing) {
        throw new AppError_1.AppError(`Approval "${id}" was not found`, 404);
    }
    if (existing.status !== 'PENDING') {
        throw new AppError_1.AppError(`Approval "${id}" has already been decided`, 409);
    }
    const updated = await approvalRepository.decide(id, status, comment);
    if (!updated) {
        throw new AppError_1.AppError(`Approval "${id}" has already been decided`, 409);
    }
    auditLogService.record({
        action: status === 'APPROVED' ? 'APPROVAL_APPROVED' : 'APPROVAL_REJECTED',
        module: 'APPROVALS',
        target: updated.title,
        description: `${status === 'APPROVED' ? 'Approved' : 'Rejected'} a pending ${updated.type.toLowerCase()} request.`,
        previousValue: 'status: PENDING',
        newValue: `status: ${status}`,
    }, actorId);
    // Notify the person who requested the approval, not the approver who just
    // acted — the frontend's own post-hoc notification create() call notifies
    // whoever is logged in (i.e. the approver), which is only correct in mock
    // mode where notifications aren't scoped to a specific user yet.
    notificationService.notify({
        type: 'APPROVAL',
        title: 'Approval decision',
        message: `Your ${updated.title} was ${status === 'APPROVED' ? 'approved' : 'rejected'}.`,
    }, updated.requestedBy.id);
    return updated;
}
async function approveApproval(id, comment, actorId) {
    return decide(id, 'APPROVED', comment, actorId);
}
async function rejectApproval(id, comment, actorId) {
    return decide(id, 'REJECTED', comment, actorId);
}
//# sourceMappingURL=approvalService.js.map