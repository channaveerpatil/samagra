"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthRoutes_1 = __importDefault(require("./healthRoutes"));
const customerRoutes_1 = __importDefault(require("./customerRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const approvalRoutes_1 = __importDefault(require("./approvalRoutes"));
const auditLogRoutes_1 = __importDefault(require("./auditLogRoutes"));
const reportRoutes_1 = __importDefault(require("./reportRoutes"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
const documentRoutes_1 = __importDefault(require("./documentRoutes"));
const router = (0, express_1.Router)();
router.use(healthRoutes_1.default);
router.use(customerRoutes_1.default);
router.use(userRoutes_1.default);
router.use(authRoutes_1.default);
router.use(approvalRoutes_1.default);
router.use(auditLogRoutes_1.default);
router.use(reportRoutes_1.default);
router.use(notificationRoutes_1.default);
router.use(documentRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map