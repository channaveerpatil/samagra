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
exports.attachUser = attachUser;
exports.requireAuth = requireAuth;
const cookies_1 = require("../utils/cookies");
const env_1 = require("../config/env");
const authService = __importStar(require("../services/authService"));
const AppError_1 = require("../utils/AppError");
async function attachUser(req, _res, next) {
    try {
        const sessionId = (0, cookies_1.parseCookies)(req)[env_1.config.sessionCookieName];
        if (sessionId) {
            req.user = await authService.getUserForSession(sessionId);
        }
        next();
    }
    catch (err) {
        next(err);
    }
}
function requireAuth(req, _res, next) {
    if (!req.user) {
        next(new AppError_1.AppError('Authentication required', 401));
        return;
    }
    next();
}
//# sourceMappingURL=auth.js.map