import * as XLSX from 'xlsx';
import { saveBlobAsFile } from '@/features/reports/utils/saveBlobAsFile';
import { CUSTOMER_STATUS_LABELS } from '../types';
import type { Customer } from '../types';

function formatDate(isoDate: string): string {
  return new Date(isoDate).toISOString().slice(0, 10);
}

function buildFileName(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `customers-${today}.xlsx`;
}

export function exportCustomersToExcel(customers: Customer[]): void {
  const rows = customers.map((customer) => ({
    'Customer ID': customer.id,
    Name: customer.name,
    Email: customer.email,
    Phone: customer.phone,
    Company: customer.company,
    Status: CUSTOMER_STATUS_LABELS[customer.status],
    'Created Date': formatDate(customer.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveBlobAsFile(blob, buildFileName());
}
