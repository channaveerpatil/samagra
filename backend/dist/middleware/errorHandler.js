"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
function errorHandler(err, req, res, 
// Express only treats a middleware as an error handler if it declares 4 parameters.
_next) {
    const statusCode = err instanceof AppError_1.AppError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    logger_1.logger.error(`${req.method} ${req.originalUrl} failed: ${message}`, err);
    res.status(statusCode).json({
        error: {
            message: statusCode === 500 && env_1.config.nodeEnv === 'production' ? 'Internal server error' : message,
        },
    });
}
//# sourceMappingURL=errorHandler.js.map