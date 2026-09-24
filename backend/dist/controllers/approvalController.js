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
const approvalService = __importStar(require("../services/approvalService"));
const AppError_1 = require("../utils/AppError");
const VALID_TYPES = ['PURCHASE', 'ACCESS', 'CUSTOMER_CHANGE', 'PROJECT', 'OTHER'];
function parseApprovalInput(body) {
    const { title, description, type, amount } = (body ?? {});
    if (!title) {
        throw new AppError_1.AppError('"title" is required', 400);
    }
    if (!description) {
        throw new AppError_1.AppError('"description" is required', 400);
    }
    if (!type || !VALID_TYPES.includes(type)) {
        throw new AppError_1.AppError(`"type" must be one of: ${VALID_TYPES.join(', ')}`, 400);
    }
    return { title, description, type, amount };
}
async function listApprovals(_req, res, next) {
    try {
        res.status(200).json(await approvalService.listApprovals());
    }
    catch (err) {
        next(err);
    }
}
async function getApproval(req, res, next) {
    try {
        res.status(200).json(await approvalService.getApproval(req.params.id));
    }
    catch (err) {
        next(err);
    }
}
async function createApprovalRequest(req, res, next) {
    try {
        const input = parseApprovalInput(req.body);
        res.status(201).json(await approvalService.createApprovalRequest(input, req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function approveApproval(req, res, next) {
    try {
        const { comment } = (req.body ?? {});
        res.status(200).json(await approvalService.approveApproval(req.params.id, comment, req.user?.id));
    }
    catch (err) {
        next(err);
    }
}
async function rejectApproval(req, res, next) {
    try {
        const { comment } = (req.body ?? {});
        res.status(200).json(await approvalService.rejectApproval(req.params.id, comment, req.user?.id));
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=approvalController.js.map