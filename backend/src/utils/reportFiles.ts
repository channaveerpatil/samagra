import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const REPORTS_DIR = join(__dirname, '..', '..', 'storage', 'reports');

export function reportFilePath(fileName: string): string {
  return join(REPORTS_DIR, fileName);
}

export function writeReportFile(fileName: string, buffer: Buffer): string {
  mkdirSync(REPORTS_DIR, { recursive: true });
  const path = reportFilePath(fileName);
  writeFileSync(path, buffer);
  return path;
}

export function readReportFile(path: string): Buffer {
  return readFileSync(path);
}
