"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/auth/register', authController_1.register);
router.post('/auth/login', authController_1.login);
router.post('/auth/forgot-password', authController_1.forgotPassword);
router.post('/auth/logout', authController_1.logout);
router.get('/auth/me', authController_1.me);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map