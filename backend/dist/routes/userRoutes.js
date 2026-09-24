"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/users', userController_1.listUsers);
router.post('/users', userController_1.createUser);
router.put('/users/:id', userController_1.updateUser);
router.patch('/users/me', auth_1.requireAuth, userController_1.updateOwnProfile);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map