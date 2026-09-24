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
exports.listDocuments = listDocuments;
exports.uploadDocument = uploadDocument;
exports.downloadDocument = downloadDocument;
exports.removeDocument = removeDocument;
const documentService = __importStar(require("../services/documentService"));
const AppError_1 = require("../utils/AppError");
function sanitizeForContentDisposition(fileName) {
    return fileName.replace(/[\r\n"]/g, '');
}
async function listDocuments(_req, res, next) {
    try {
        res.status(200).json(await documentService.listDocuments());
    }
    catch (err) {
        next(err);
    }
}
async function uploadDocument(req, res, next) {
    try {
        if (!req.file) {
            throw new AppError_1.AppError('Please select a file.', 400);
        }
        const document = await documentService.uploadDocument({
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            buffer: req.file.buffer,
            size: req.file.size,
        }, req.user.id);
        res.status(201).json(document);
    }
    catch (err) {
        next(err);
    }
}
async function downloadDocument(req, res, next) {
    try {
        const { buffer, document } = await documentService.downloadDocument(req.params.id);
        res.setHeader('Content-Type', document.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizeForContentDisposition(document.originalName)}"`);
        res.status(200).send(buffer);
    }
    catch (err) {
        next(err);
    }
}
async function removeDocument(req, res, next) {
    try {
        await documentService.removeDocument(req.params.id, req.user?.id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=documentController.js.map