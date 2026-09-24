import { extname } from 'path';
import * as documentRepository from '../repositories/documentRepository';
import * as auditLogService from './auditLogService';
import { writeDocumentFile, readDocumentFile, removeDocumentFile } from '../utils/documentFiles';
import { isAllowedDocumentType } from '../utils/documentValidation';
import type { DocumentFile } from '../models/Document';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export async function listDocuments(): Promise<DocumentFile[]> {
  return documentRepository.findAll();
}

export interface UploadDocumentInput {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
  size: number;
}

export async function uploadDocument(
  input: UploadDocumentInput,
  uploadedById: string,
): Promise<DocumentFile> {
  const extension = extname(input.originalName).toLowerCase();

  if (!isAllowedDocumentType(extension, input.mimeType)) {
    throw new AppError('File type is not supported.', 400);
  }

  const id = documentRepository.generateId();
  const storedName = `${id}${extension}`;

  let storagePath: string;
  try {
    storagePath = writeDocumentFile(storedName, input.buffer);
  } catch (err) {
    logger.error('Failed to write document to storage', err);
    throw new AppError('Failed to store the uploaded file. Please try again.', 500);
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

    auditLogService.record(
      {
        action: 'DOCUMENT_UPLOADED',
        module: 'DOCUMENTS',
        target: document.originalName,
        description: 'Uploaded a new document.',
      },
      uploadedById,
    );

    return document;
  } catch (err) {
    removeDocumentFile(storagePath);
    logger.error('Failed to persist document metadata', err);
    throw new AppError('Failed to save the document. Please try again.', 500);
  }
}

export async function downloadDocument(
  id: string,
): Promise<{ buffer: Buffer; document: DocumentFile }> {
  const document = await documentRepository.findById(id);
  if (!document) {
    throw new AppError(`Document "${id}" was not found`, 404);
  }

  const storagePath = await documentRepository.findStoragePath(id);
  if (!storagePath) {
    throw new AppError('Document file was not found', 404);
  }

  let buffer: Buffer;
  try {
    buffer = readDocumentFile(storagePath);
  } catch (err) {
    logger.error(`Failed to read document file for "${id}"`, err);
    throw new AppError('Document file was not found', 404);
  }

  return { buffer, document };
}

export async function removeDocument(id: string, actorId: string | undefined): Promise<void> {
  const document = await documentRepository.findById(id);
  if (!document) {
    throw new AppError(`Document "${id}" was not found`, 404);
  }

  const storagePath = await documentRepository.findStoragePath(id);
  const removed = await documentRepository.remove(id);
  if (!removed) {
    throw new AppError(`Document "${id}" was not found`, 404);
  }

  if (storagePath) {
    removeDocumentFile(storagePath);
  }

  auditLogService.record(
    {
      action: 'DOCUMENT_DELETED',
      module: 'DOCUMENTS',
      target: document.originalName,
      description: 'Deleted a document.',
    },
    actorId,
  );
}
