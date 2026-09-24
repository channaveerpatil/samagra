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
const customerRepository = __importStar(require("../repositories/customerRepository"));
const auditLogService = __importStar(require("./auditLogService"));
const AppError_1 = require("../utils/AppError");
async function listCustomers() {
    return customerRepository.findAll();
}
async function getCustomer(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
        throw new AppError_1.AppError(`Customer "${id}" was not found`, 404);
    }
    return customer;
}
async function createCustomer(input, actorId) {
    const customer = await customerRepository.create(input);
    auditLogService.record({
        action: 'CUSTOMER_CREATED',
        module: 'CUSTOMERS',
        target: customer.company,
        description: 'Created a new customer record.',
        newValue: `status: ${customer.status}`,
    }, actorId);
    return customer;
}
async function updateCustomer(id, input) {
    const updated = await customerRepository.update(id, input);
    if (!updated) {
        throw new AppError_1.AppError(`Customer "${id}" was not found`, 404);
    }
    return updated;
}
async function removeCustomer(id) {
    const removed = await customerRepository.remove(id);
    if (!removed) {
        throw new AppError_1.AppError(`Customer "${id}" was not found`, 404);
    }
}
//# sourceMappingURL=customerService.js.map