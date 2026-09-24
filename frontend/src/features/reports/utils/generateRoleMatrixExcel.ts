import * as XLSX from 'xlsx';
import { ROLES } from '@/lib/auth/roles';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { PERMISSION_LABELS } from '@/lib/auth/permissionLabels';
import { ROLE_PERMISSIONS } from '@/lib/auth/rolePermissions';
import { ROLE_ACCESS_INFO } from '@/lib/auth/roleAccessInfo';

export interface GeneratedReportFile {
  blob: Blob;
  fileName: string;
}

const ROLE_ORDER = Object.values(ROLES);

const CATEGORY_LABELS: Record<string, string> = {
  DASHBOARD: 'General',
  CUSTOMER: 'Customers',
  REPORT: 'Reports',
  SETTINGS: 'Settings',
  USER: 'User Management',
  RBAC: 'RBAC',
  APPROVAL: 'Approvals',
};

function categoryOf(permission: string): string {
  const prefix = permission.split('_')[0];
  return CATEGORY_LABELS[prefix] ?? prefix;
}

function buildFileName(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `role-matrix-${today}.xlsx`;
}

export async function generateRoleMatrixExcel(): Promise<GeneratedReportFile> {
  const rows = Object.values(PERMISSIONS).map((permission) => {
    const row: Record<string, string> = {
      Category: categoryOf(permission),
      Permission: PERMISSION_LABELS[permission],
    };
    ROLE_ORDER.forEach((role) => {
      row[ROLE_ACCESS_INFO[role].label] = ROLE_PERMISSIONS[role].includes(permission)
        ? 'Yes'
        : 'No';
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Role Matrix');

  const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  return { blob, fileName: buildFileName() };
}
