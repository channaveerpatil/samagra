import multer from 'multer';
import { config } from '../config/env';

export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSizeBytes },
});
