"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const path_1 = require("path");
function parsePort(value, fallback) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
function parseNodeEnv(value) {
    if (value === 'production' || value === 'test') {
        return value;
    }
    return 'development';
}
function parsePositiveInt(value, fallback) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
const DEFAULT_FILE_STORAGE_PATH = (0, path_1.join)(__dirname, '..', '..', 'storage', 'documents');
const DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
function resolveFileStoragePath(value) {
    if (!value) {
        return DEFAULT_FILE_STORAGE_PATH;
    }
    return (0, path_1.isAbsolute)(value) ? value : (0, path_1.join)(__dirname, '..', '..', value);
}
exports.config = {
    port: parsePort(process.env.PORT, 3000),
    nodeEnv: parseNodeEnv(process.env.NODE_ENV),
    databaseUrl: process.env.DATABASE_URL ??
        'postgres://starterkit:starterkit@localhost:5432/starterkit',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    sessionCookieName: 'sk_session',
    sessionTtlMs: 7 * 24 * 60 * 60 * 1000,
    fileStoragePath: resolveFileStoragePath(process.env.FILE_STORAGE_PATH),
    maxFileSizeBytes: parsePositiveInt(process.env.MAX_FILE_SIZE, DEFAULT_MAX_FILE_SIZE_BYTES),
};
//# sourceMappingURL=env.js.map