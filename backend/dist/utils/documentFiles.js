"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentFilePath = documentFilePath;
exports.writeDocumentFile = writeDocumentFile;
exports.readDocumentFile = readDocumentFile;
exports.removeDocumentFile = removeDocumentFile;
const fs_1 = require("fs");
const path_1 = require("path");
const env_1 = require("../config/env");
function documentFilePath(storedName) {
    return (0, path_1.join)(env_1.config.fileStoragePath, storedName);
}
function writeDocumentFile(storedName, buffer) {
    (0, fs_1.mkdirSync)(env_1.config.fileStoragePath, { recursive: true });
    const path = documentFilePath(storedName);
    (0, fs_1.writeFileSync)(path, buffer);
    return path;
}
function readDocumentFile(path) {
    return (0, fs_1.readFileSync)(path);
}
function removeDocumentFile(path) {
    try {
        (0, fs_1.unlinkSync)(path);
    }
    catch {
        // File already missing on disk — nothing left to clean up.
    }
}
//# sourceMappingURL=documentFiles.js.map