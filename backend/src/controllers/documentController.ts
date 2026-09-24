import type { NextFunction, Request, Response } from 'express';
import * as documentService from '../services/documentService';
import { AppError } from '../utils/AppError';

function sanitizeForContentDisposition(fileName: string): string {
  return fileName.replace(/[\r\n"]/g, '');
}

export async function listDocuments(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await documentService.listDocuments());
  } catch (err) {
    next(err);
  }
}

export async function uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      throw new AppError('Please select a file.', 400);
    }

    const document = await documentService.uploadDocument(
      {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        buffer: req.file.buffer,
        size: req.file.size,
      },
      req.user!.id,
    );

    res.status(201).json(document);
  } catch (err) {
    next(err);
  }
}

export async function downloadDocument(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { buffer, document } = await documentService.downloadDocument(req.params.id);
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${sanitizeForContentDisposition(document.originalName)}"`,
    );
    res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
}

export async function removeDocument(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await documentService.removeDocument(req.params.id, req.user?.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
