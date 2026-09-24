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
const path_1 = require("path");
const documentRepository = __importStar(require("../repositories/documentRepository"));
const auditLogService = __importStar(require("./auditLogService"));
const documentFiles_1 = require("../utils/documentFiles");
const documentValidation_1 = require("../utils/documentValidation");
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
async function listDocuments() {
    return documentRepository.findAll();
}
async function uploadDocument(input, uploadedById) {
    const extension = (0, path_1.extname)(input.originalName).toLowerCase();
    if (!(0, documentValidation_1.isAllowedDocumentType)(extension, input.mimeType)) {
        throw new AppError_1.AppError('File type is not supported.', 400);
    }
    const id = documentRepository.generateId();
    const storedName = `${id}${extension}`;
    let storagePath;
    try {
        storagePath = (0, documentFiles_1.writeDocumentFile)(storedName, input.buffer);
    }
    catch (err) {
        logger_1.logger.error('Failed to write document to storage', err);
        throw new AppError_1.AppError('Failed to store the uploaded file. Please try again.', 500);
    }
    try {
        const document = await documentRepository.create({
            id,
            originalName: input.originalName,
            storedName,
            mimeType: input.mimeType,
            fileSize: input.size,
            storagePath,
            uploadedById,
        });
        auditLogService.record({
            action: 'DOCUMENT_UPLOADED',
            module: 'DOCUMENTS',
            target: document.originalName,
            description: 'Uploaded a new document.',
        }, uploadedById);
        return document;
    }
    catch (err) {
        (0, documentFiles_1.removeDocumentFile)(storagePath);
        logger_1.logger.error('Failed to persist document metadata', err);
        throw new AppError_1.AppError('Failed to save the document. Please try again.', 500);
    }
}
async function downloadDocument(id) {
    const document = await documentRepository.findById(id);
    if (!document) {
        throw new AppError_1.AppError(`Document "${id}" was not found`, 404);
    }
    const storagePath = await documentRepository.findStoragePath(id);
    if (!storagePath) {
        throw new AppError_1.AppError('Document file was not found', 404);
    }
    let buffer;
    try {
        buffer = (0, documentFiles_1.readDocumentFile)(storagePath);
    }
    catch (err) {
        logger_1.logger.error(`Failed to read document file for "${id}"`, err);
        throw new AppError_1.AppError('Document file was not found', 404);
    }
    return { buffer, document };
}
async function removeDocument(id, actorId) {
    const document = await documentRepository.findById(id);
    if (!document) {
        throw new AppError_1.AppError(`Document "${id}" was not found`, 404);
    }
    const storagePath = await documentRepository.findStoragePath(id);
    const removed = await documentRepository.remove(id);
    if (!removed) {
        throw new AppError_1.AppError(`Document "${id}" was not found`, 404);
    }
    if (storagePath) {
        (0, documentFiles_1.removeDocumentFile)(storagePath);
    }
    auditLogService.record({
        action: 'DOCUMENT_DELETED',
        module: 'DOCUMENTS',
        target: document.originalName,
        description: 'Deleted a document.',
    }, actorId);
}
//# sourceMappingURL=documentService.js.map