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
exports.generateReportFile = generateReportFile;
const XLSX = __importStar(require("xlsx"));
const customerRepository = __importStar(require("../repositories/customerRepository"));
const userRepository = __importStar(require("../repositories/userRepository"));
const ROLE_LABELS = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    USER: 'User',
    VIEWER: 'Viewer',
};
const CUSTOMER_STATUS_LABELS = {
    active: 'Active',
    inactive: 'Inactive',
    lead: 'Lead',
};
function formatDate(isoDate) {
    return new Date(isoDate).toISOString().slice(0, 10);
}
function toBuffer(workbook) {
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
async function generateCustomerReport() {
    const customers = await customerRepository.findAll();
    const rows = customers.map((customer) => ({
        'Customer ID': customer.id,
        'Customer Name': customer.name,
        Email: customer.email,
        Status: CUSTOMER_STATUS_LABELS[customer.status] ?? customer.status,
        'Created Date': formatDate(customer.createdAt),
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    return {
        buffer: toBuffer(workbook),
        fileName: `customer-report-${formatDate(new Date().toISOString())}.xlsx`,
    };
}
// Reads from the real users table rather than a mock array — this backend
// generator replaces the frontend's client-side equivalent, which reads
// MOCK_USERS (a known stale data source independent of this migration).
async function generateUserReport() {
    const users = await userRepository.findAll();
    const rows = users.map((user) => ({
        'User ID': user.id,
        Name: `${user.firstName} ${user.lastName}`.trim(),
        Email: user.email,
        Role: ROLE_LABELS[user.role] ?? user.role,
        Company: user.company ?? '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    return {
        buffer: toBuffer(workbook),
        fileName: `user-access-report-${formatDate(new Date().toISOString())}.xlsx`,
    };
}
async function generateReportFile(reportType) {
    if (reportType === 'CUSTOMER') {
        return generateCustomerReport();
    }
    return generateUserReport();
}
//# sourceMappingURL=reportGenerationService.js.map