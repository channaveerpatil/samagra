"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const AppError_1 = require("../utils/AppError");
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            next(new AppError_1.AppError('You do not have permission to perform this action', 403));
            return;
        }
        next();
    };
}
//# sourceMappingURL=requireRole.js.map