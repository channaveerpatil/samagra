"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportFilePath = reportFilePath;
exports.writeReportFile = writeReportFile;
exports.readReportFile = readReportFile;
const fs_1 = require("fs");
const path_1 = require("path");
const REPORTS_DIR = (0, path_1.join)(__dirname, '..', '..', 'storage', 'reports');
function reportFilePath(fileName) {
    return (0, path_1.join)(REPORTS_DIR, fileName);
}
function writeReportFile(fileName, buffer) {
    (0, fs_1.mkdirSync)(REPORTS_DIR, { recursive: true });
    const path = reportFilePath(fileName);
    (0, fs_1.writeFileSync)(path, buffer);
    return path;
}
function readReportFile(path) {
    return (0, fs_1.readFileSync)(path);
}
//# sourceMappingURL=reportFiles.js.map