"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.updateOwnProfile = updateOwnProfile;
const userService = __importStar(require("../services/userService"));
const AppError_1 = require("../utils/AppError");
const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'VIEWER'];
function parseUserInput(body) {
    const { firstName, lastName, email, role, phone, company, website } = (body ?? {});
    if (!firstName) {
        throw new AppError_1.AppError('"firstName" is required', 400);
    }
    if (!lastName) {
        throw new AppError_1.AppError('"lastName" is required', 400);
    }
    if (!email) {
        throw new AppError_1.AppError('"email" is required', 400);
    }
    if (!role || !VALID_ROLES.includes(role)) {
        throw new AppError_1.AppError('"role" must be one of: SUPER_ADMIN, ADMIN, MANAGER, USER, VIEWER', 400);
    }
    return { firstName, lastName, email, role, phone, company, website };
}
function parseProfileUpdate(body) {
    const { firstName, lastName, phone, company, website } = (body ?? {});
    return { firstName, lastName, phone, company, website };
}
async function listUsers(_req, res, next) {
    try {
        res.status(200).json(await userService.listUsers());
    }
    catch (err) {
        next(err);
    }
}
async function createUser(req, res, next) {
    try {
        const input = parseUserInput(req.body);
        res.status(201).json(await userService.createUser(input, req.user?.id));
    }
    catch (err) {
        next(err);
    }
}
async function updateUser(req, res, next) {
    try {
        const input = parseUserInput(req.body);
        res.status(200).json(await userService.updateUser(req.params.id, input, req.user?.id));
    }
    catch (err) {
        next(err);
    }
}
async function updateOwnProfile(req, res, next) {
    try {
        const updates = parseProfileUpdate(req.body);
        res.status(200).json(await userService.updateOwnProfile(req.user.id, updates));
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=userController.js.map