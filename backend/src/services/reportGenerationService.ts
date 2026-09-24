import * as XLSX from 'xlsx';
import * as customerRepository from '../repositories/customerRepository';
import * as userRepository from '../repositories/userRepository';
import type { ReportType } from '../models/Report';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User',
  VIEWER: 'Viewer',
};

const CUSTOMER_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  lead: 'Lead',
};

function formatDate(isoDate: string): string {
  return new Date(isoDate).toISOString().slice(0, 10);
}

function toBuffer(workbook: XLSX.WorkBook): Buffer {
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

async function generateCustomerReport(): Promise<{ buffer: Buffer; fileName: string }> {
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
async function generateUserReport(): Promise<{ buffer: Buffer; fileName: string }> {
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

export async function generateReportFile(
  reportType: ReportType,
): Promise<{ buffer: Buffer; fileName: string }> {
  if (reportType === 'CUSTOMER') {
    return generateCustomerReport();
  }
  return generateUserReport();
}
