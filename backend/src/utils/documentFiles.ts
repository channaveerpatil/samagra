import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { config } from '../config/env';

export function documentFilePath(storedName: string): string {
  return join(config.fileStoragePath, storedName);
}

export function writeDocumentFile(storedName: string, buffer: Buffer): string {
  mkdirSync(config.fileStoragePath, { recursive: true });
  const path = documentFilePath(storedName);
  writeFileSync(path, buffer);
  return path;
}

export function readDocumentFile(path: string): Buffer {
  return readFileSync(path);
}

export function removeDocumentFile(path: string): void {
  try {
    unlinkSync(path);
  } catch {
    // File already missing on disk — nothing left to clean up.
  }
}
