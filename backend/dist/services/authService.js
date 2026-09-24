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
exports.register = register;
exports.resetPassword = resetPassword;
exports.login = login;
exports.logout = logout;
exports.getUserForSession = getUserForSession;
const userRepository = __importStar(require("../repositories/userRepository"));
const sessionRepository = __importStar(require("../repositories/sessionRepository"));
const password_1 = require("../utils/password");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
async function register(input) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
        throw new AppError_1.AppError('An account with this email already exists', 409);
    }
    const passwordHash = await (0, password_1.hashPassword)(input.password);
    const user = await userRepository.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        role: 'USER',
        company: input.company,
    }, passwordHash);
    const session = await sessionRepository.create(user.id, env_1.config.sessionTtlMs);
    return { user, session };
}
async function resetPassword(email, newPassword) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new AppError_1.AppError('No account found with this email', 404);
    }
    const passwordHash = await (0, password_1.hashPassword)(newPassword);
    await userRepository.updatePasswordHash(user.id, passwordHash);
}
async function login(email, password) {
    const credential = await userRepository.findCredentialByEmail(email);
    if (!credential || !credential.passwordHash) {
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    const valid = await (0, password_1.verifyPassword)(password, credential.passwordHash);
    if (!valid) {
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    const session = await sessionRepository.create(credential.user.id, env_1.config.sessionTtlMs);
    return { user: credential.user, session };
}
async function logout(sessionId) {
    await sessionRepository.remove(sessionId);
}
async function getUserForSession(sessionId) {
    const session = await sessionRepository.findValidById(sessionId);
    if (!session) {
        return undefined;
    }
    return userRepository.findById(session.userId);
}
//# sourceMappingURL=authService.js.map