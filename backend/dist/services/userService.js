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
const userRepository = __importStar(require("../repositories/userRepository"));
const auditLogService = __importStar(require("./auditLogService"));
const AppError_1 = require("../utils/AppError");
async function listUsers() {
    return userRepository.findAll();
}
async function createUser(input, actorId) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
        throw new AppError_1.AppError(`A user with email "${input.email}" already exists`, 409);
    }
    const user = await userRepository.create(input);
    auditLogService.record({
        action: 'USER_CREATED',
        module: 'USERS',
        target: `${user.firstName} ${user.lastName} (${user.email})`,
        description: `Added a new user account with the ${user.role} role.`,
        newValue: `role: ${user.role}`,
    }, actorId);
    return user;
}
async function updateUser(id, input, actorId) {
    const existingWithEmail = await userRepository.findByEmail(input.email);
    if (existingWithEmail && existingWithEmail.id !== id) {
        throw new AppError_1.AppError(`A user with email "${input.email}" already exists`, 409);
    }
    const before = await userRepository.findById(id);
    const updated = await userRepository.update(id, input);
    if (!updated) {
        throw new AppError_1.AppError(`User "${id}" was not found`, 404);
    }
    if (before && before.role !== updated.role) {
        auditLogService.record({
            action: 'USER_ROLE_CHANGED',
            module: 'USERS',
            target: `${updated.firstName} ${updated.lastName} (${updated.email})`,
            description: `Changed ${updated.firstName} ${updated.lastName}'s role from ${before.role} to ${updated.role}.`,
            previousValue: `role: ${before.role}`,
            newValue: `role: ${updated.role}`,
        }, actorId);
    }
    return updated;
}
async function updateOwnProfile(id, updates) {
    const updated = await userRepository.updateProfile(id, updates);
    if (!updated) {
        throw new AppError_1.AppError(`User "${id}" was not found`, 404);
    }
    return updated;
}
//# sourceMappingURL=userService.js.map