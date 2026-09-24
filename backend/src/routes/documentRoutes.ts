import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import {
  listDocuments,
  uploadDocument,
  downloadDocument,
  removeDocument,
} from '../controllers/documentController';
import { documentUpload } from '../middleware/documentUpload';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';

const router = Router();

const maxFileSizeMb = Math.round(config.maxFileSizeBytes / (1024 * 1024));

function parseSingleFile(req: Request, res: Response, next: NextFunction): void {
  documentUpload.single('file')(req, res, (err: unknown) => {
    if (!err) {
      next();
      return;
    }

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new AppError(`File size must be ${maxFileSizeMb} MB or less.`, 400));
      return;
    }

    next(new AppError('Failed to process the uploaded file.', 400));
  });
}

router.get('/documents', requireAuth, listDocuments);
router.post('/documents', requireAuth, parseSingleFile, uploadDocument);
router.get('/documents/:id/download', requireAuth, downloadDocument);
router.delete('/documents/:id', requireAuth, removeDocument);

export default router;
