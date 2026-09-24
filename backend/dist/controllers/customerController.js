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
exports.listCustomers = listCustomers;
exports.getCustomer = getCustomer;
exports.createCustomer = createCustomer;
exports.updateCustomer = updateCustomer;
exports.removeCustomer = removeCustomer;
const customerService = __importStar(require("../services/customerService"));
const AppError_1 = require("../utils/AppError");
const VALID_STATUSES = ['active', 'inactive', 'lead'];
function parseCustomerInput(body) {
    const { name, email, phone, company, status } = (body ?? {});
    if (!name) {
        throw new AppError_1.AppError('"name" is required', 400);
    }
    if (!email) {
        throw new AppError_1.AppError('"email" is required', 400);
    }
    if (!phone) {
        throw new AppError_1.AppError('"phone" is required', 400);
    }
    if (!company) {
        throw new AppError_1.AppError('"company" is required', 400);
    }
    if (!status || !VALID_STATUSES.includes(status)) {
        throw new AppError_1.AppError('"status" must be one of: active, inactive, lead', 400);
    }
    return { name, email, phone, company, status };
}
async function listCustomers(_req, res, next) {
    try {
        res.status(200).json(await customerService.listCustomers());
    }
    catch (err) {
        next(err);
    }
}
async function getCustomer(req, res, next) {
    try {
        res.status(200).json(await customerService.getCustomer(req.params.id));
    }
    catch (err) {
        next(err);
    }
}
async function createCustomer(req, res, next) {
    try {
        const input = parseCustomerInput(req.body);
        res.status(201).json(await customerService.createCustomer(input, req.user?.id));
    }
    catch (err) {
        next(err);
    }
}
async function updateCustomer(req, res, next) {
    try {
        const input = parseCustomerInput(req.body);
        res.status(200).json(await customerService.updateCustomer(req.params.id, input));
    }
    catch (err) {
        next(err);
    }
}
async function removeCustomer(req, res, next) {
    try {
        await customerService.removeCustomer(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=customerController.js.map