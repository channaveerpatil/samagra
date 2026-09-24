"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function write(level, message, meta) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    if (meta !== undefined) {
        console[level](line, meta);
    }
    else {
        console[level](line);
    }
}
exports.logger = {
    info: (message, meta) => write('info', message, meta),
    warn: (message, meta) => write('warn', message, meta),
    error: (message, meta) => write('error', message, meta),
};
//# sourceMappingURL=logger.js.map