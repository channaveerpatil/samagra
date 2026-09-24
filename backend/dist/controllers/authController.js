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
exports.login = login;
exports.register = register;
exports.forgotPassword = forgotPassword;
exports.logout = logout;
exports.me = me;
const authService = __importStar(require("../services/authService"));
const env_1 = require("../config/env");
const cookies_1 = require("../utils/cookies");
const AppError_1 = require("../utils/AppError");
function setSessionCookie(res, sessionId) {
    res.setHeader('Set-Cookie', (0, cookies_1.buildSetCookie)(env_1.config.sessionCookieName, sessionId, {
        maxAgeMs: env_1.config.sessionTtlMs,
        secure: env_1.config.nodeEnv === 'production',
    }));
}
function clearSessionCookie(res) {
    res.setHeader('Set-Cookie', (0, cookies_1.buildClearCookie)(env_1.config.sessionCookieName, { secure: env_1.config.nodeEnv === 'production' }));
}
async function login(req, res, next) {
    try {
        const { email, password } = (req.body ?? {});
        if (!email || !password) {
            throw new AppError_1.AppError('"email" and "password" are required', 400);
        }
        const { user, session } = await authService.login(email, password);
        setSessionCookie(res, session.id);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
}
async function register(req, res, next) {
    try {
        const { firstName, lastName, email, password, company } = (req.body ?? {});
        if (!firstName || !lastName || !email || !password) {
            throw new AppError_1.AppError('"firstName", "lastName", "email" and "password" are required', 400);
        }
        if (password.length < 8) {
            throw new AppError_1.AppError('Password must be at least 8 characters', 400);
        }
        const { user, session } = await authService.register({
            firstName,
            lastName,
            email,
            password,
            company,
        });
        setSessionCookie(res, session.id);
        res.status(201).json(user);
    }
    catch (err) {
        next(err);
    }
}
async function forgotPassword(req, res, next) {
    try {
        const { email, password } = (req.body ?? {});
        if (!email || !password) {
            throw new AppError_1.AppError('"email" and "password" are required', 400);
        }
        if (password.length < 8) {
            throw new AppError_1.AppError('Password must be at least 8 characters', 400);
        }
        await authService.resetPassword(email, password);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function logout(req, res, next) {
    try {
        const sessionId = (0, cookies_1.parseCookies)(req)[env_1.config.sessionCookieName];
        if (sessionId) {
            await authService.logout(sessionId);
        }
        clearSessionCookie(res);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
function me(req, res) {
    if (!req.user) {
        res.status(200).json(null);
        return;
    }
    res.status(200).json(req.user);
}
//# sourceMappingURL=authController.js.map