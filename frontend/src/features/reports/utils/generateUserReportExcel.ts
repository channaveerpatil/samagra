import * as XLSX from 'xlsx';
import { MOCK_USERS } from '@/lib/auth/mockUsers';
import { ROLES } from '@/lib/auth/roles';

export interface GeneratedReportFile {
  blob: Blob;
  fileName: string;
}

const ROLE_LABELS: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.USER]: 'User',
  [ROLES.VIEWER]: 'Viewer',
};

function buildFileName(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `user-access-report-${today}.xlsx`;
}

// Reuses the existing mock user directory (lib/auth/mockUsers) rather than
// creating a separate user dataset for reporting. AuthUser has no status or
// createdAt field yet, so those columns are intentionally omitted — the same
// approach already used for the Customer report's omitted "Country" column.
export async function generateUserReportExcel(): Promise<GeneratedReportFile> {
  const rows = MOCK_USERS.map((user) => ({
    'User ID': user.id,
    Name: user.name,
    Email: user.email,
    Role: ROLE_LABELS[user.role] ?? user.role,
    Company: user.company,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  return { blob, fileName: buildFileName() };
}
