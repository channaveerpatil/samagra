import * as XLSX from 'xlsx';
import { customersApi } from '@/features/customers/api/customersApi';
import { CUSTOMER_STATUS_LABELS } from '@/features/customers/types';

export interface GeneratedReportFile {
  blob: Blob;
  fileName: string;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toISOString().slice(0, 10);
}

function buildFileName(prefix: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `${prefix}-${today}.xlsx`;
}

// Reuses the existing Customer data source (customersApi) so the report reflects
// real application data rather than a separate hardcoded dataset. The Customer
// model has no "country" field, so that suggested column is intentionally
// omitted rather than adding a field to the existing Customers feature.
export async function generateCustomerReportExcel(): Promise<GeneratedReportFile> {
  const customers = await customersApi.list();

  const rows = customers.map((customer) => ({
    'Customer ID': customer.id,
    'Customer Name': customer.name,
    Email: customer.email,
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

  return { blob, fileName: buildFileName('customer-report') };
}
