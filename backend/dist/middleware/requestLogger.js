"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logger_1 = require("../utils/logger");
function requestLogger(req, res, next) {
    const startTime = process.hrtime.bigint();
    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
        logger_1.logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs.toFixed(1)}ms`);
    });
    next();
}
//# sourceMappingURL=requestLogger.js.map