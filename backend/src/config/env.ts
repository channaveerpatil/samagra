import 'dotenv/config';
import { isAbsolute, join } from 'path';

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  databaseUrl: string;
  corsOrigin: string;
  sessionCookieName: string;
  sessionTtlMs: number;
  fileStoragePath: string;
  maxFileSizeBytes: number;
}

function parsePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNodeEnv(value: string | undefined): AppConfig['nodeEnv'] {
  if (value === 'production' || value === 'test') {
    return value;
  }
  return 'development';
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const DEFAULT_FILE_STORAGE_PATH = join(__dirname, '..', '..', 'storage', 'documents');
const DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function resolveFileStoragePath(value: string | undefined): string {
  if (!value) {
    return DEFAULT_FILE_STORAGE_PATH;
  }
  return isAbsolute(value) ? value : join(__dirname, '..', '..', value);
}

export const config: AppConfig = {
  port: parsePort(process.env.PORT, 3000),
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgres://starterkit:starterkit@localhost:5432/starterkit',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  sessionCookieName: 'sk_session',
  sessionTtlMs: 7 * 24 * 60 * 60 * 1000,
  fileStoragePath: resolveFileStoragePath(process.env.FILE_STORAGE_PATH),
  maxFileSizeBytes: parsePositiveInt(process.env.MAX_FILE_SIZE, DEFAULT_MAX_FILE_SIZE_BYTES),
};
