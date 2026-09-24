"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const documentController_1 = require("../controllers/documentController");
const documentUpload_1 = require("../middleware/documentUpload");
const auth_1 = require("../middleware/auth");
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
const maxFileSizeMb = Math.round(env_1.config.maxFileSizeBytes / (1024 * 1024));
function parseSingleFile(req, res, next) {
    documentUpload_1.documentUpload.single('file')(req, res, (err) => {
        if (!err) {
            next();
            return;
        }
        if (err instanceof multer_1.default.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            next(new AppError_1.AppError(`File size must be ${maxFileSizeMb} MB or less.`, 400));
            return;
        }
        next(new AppError_1.AppError('Failed to process the uploaded file.', 400));
    });
}
router.get('/documents', auth_1.requireAuth, documentController_1.listDocuments);
router.post('/documents', auth_1.requireAuth, parseSingleFile, documentController_1.uploadDocument);
router.get('/documents/:id/download', auth_1.requireAuth, documentController_1.downloadDocument);
router.delete('/documents/:id', auth_1.requireAuth, documentController_1.removeDocument);
exports.default = router;
//# sourceMappingURL=documentRoutes.js.map