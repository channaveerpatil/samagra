import * as React from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { ROLES } from '@/lib/auth/roles';
import { MOCK_USERS } from '@/lib/auth/mockUsers';
import type { Customer, CustomerStatus } from '@/features/customers/types';
import type { ReportType } from './types';

// UI-only configuration for the Reports page: which filters a report exposes
// and how to compute its live "Report Preview" stats. Kept separate from
// reportsApi.ts (pure data/API contract) and types.ts (shared data models).
// Adding a future report (SALES, APPROVAL, AUDIT, PROJECT) means adding one
// entry here plus a definition in reportsApi.ts's MOCK_REPORTS — the page
// itself never needs to change.

export interface ReportFilterValues {
  dateFrom: string;
  dateTo: string;
  status: string;
  role: string;
  includeLeads: boolean;
  includeBasicUsers: boolean;
}

export function getDefaultFilterValues(): ReportFilterValues {
  return {
    dateFrom: '',
    dateTo: '',
    status: 'ALL',
    role: 'ALL',
    includeLeads: true,
    includeBasicUsers: true,
  };
}

export interface ReportPreviewStat {
  key: string;
  label: string;
  value: number;
  emphasis?: boolean;
}

export interface ReportPreviewContext {
  customers: Customer[];
}

export interface ReportFilterOption {
  value: string;
  label: string;
}

export type ReportAccentColor = 'primary' | 'info' | 'success' | 'warning';

export interface ReportUIConfig {
  icon: React.ReactNode;
  color: ReportAccentColor;
  dateRange: { enabled: boolean; helperText?: string };
  status: { enabled: boolean; options: ReportFilterOption[]; helperText?: string } | null;
  role: { enabled: boolean; options: ReportFilterOption[] } | null;
  dataOptions: { key: 'includeLeads' | 'includeBasicUsers'; label: string }[];
  computePreview: (
    filters: ReportFilterValues,
    context: ReportPreviewContext,
  ) => ReportPreviewStat[];
}

const CUSTOMER_STATUS_FILTER_OPTIONS: ReportFilterOption[] = [
  { value: 'ALL', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const ROLE_FILTER_OPTIONS: ReportFilterOption[] = [
  { value: 'ALL', label: 'All' },
  { value: ROLES.SUPER_ADMIN, label: 'Super Admin' },
  { value: ROLES.ADMIN, label: 'Admin' },
  { value: ROLES.MANAGER, label: 'Manager' },
  { value: ROLES.USER, label: 'User' },
  { value: ROLES.VIEWER, label: 'Viewer' },
];

function isWithinDateRange(isoDate: string, dateFrom: string, dateTo: string): boolean {
  const date = new Date(isoDate);
  if (dateFrom && date < new Date(dateFrom)) return false;
  if (dateTo && date > new Date(dateTo)) return false;
  return true;
}

const CUSTOMER_CONFIG: ReportUIConfig = {
  icon: <GroupsIcon />,
  color: 'primary',
  dateRange: { enabled: true },
  status: { enabled: true, options: CUSTOMER_STATUS_FILTER_OPTIONS },
  role: null,
  dataOptions: [{ key: 'includeLeads', label: 'Include leads when status is "All"' }],
  computePreview: (filters, { customers }) => {
    const matching = customers.filter((customer) => {
      if (filters.status !== 'ALL' && customer.status !== (filters.status as CustomerStatus)) {
        return false;
      }
      if (filters.status === 'ALL' && customer.status === 'lead' && !filters.includeLeads) {
        return false;
      }
      return isWithinDateRange(customer.createdAt, filters.dateFrom, filters.dateTo);
    });

    return [
      {
        key: 'matching',
        label: 'Customers matching your filters',
        value: matching.length,
        emphasis: true,
      },
    ];
  },
};

const USER_CONFIG: ReportUIConfig = {
  icon: <ManageAccountsOutlinedIcon />,
  color: 'info',
  dateRange: {
    enabled: false,
    helperText: 'User records don’t track a creation date yet — date filtering is disabled.',
  },
  status: {
    enabled: false,
    options: [{ value: 'ALL', label: 'All' }],
    helperText: 'User records don’t track an active/inactive status yet.',
  },
  role: { enabled: true, options: ROLE_FILTER_OPTIONS },
  dataOptions: [{ key: 'includeBasicUsers', label: 'Include Basic Users' }],
  computePreview: (filters) => {
    const matching = MOCK_USERS.filter((user) => {
      if (filters.role !== 'ALL' && user.role !== filters.role) return false;
      if (user.role === ROLES.VIEWER && !filters.includeBasicUsers) return false;
      return true;
    });
    const adminCount = matching.filter(
      (user) => user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN,
    ).length;

    return [
      { key: 'active', label: 'Active Users', value: matching.length },
      { key: 'admin', label: 'Admin Users', value: adminCount },
      { key: 'standard', label: 'Standard Users', value: matching.length - adminCount },
    ];
  },
};

const DEFAULT_CONFIG: ReportUIConfig = {
  icon: <DescriptionOutlinedIcon />,
  color: 'warning',
  dateRange: { enabled: false, helperText: 'Filters for this report are coming soon.' },
  status: null,
  role: null,
  dataOptions: [],
  computePreview: () => [],
};

const REPORT_UI_CONFIG: Partial<Record<ReportType, ReportUIConfig>> = {
  CUSTOMER: CUSTOMER_CONFIG,
  USER: USER_CONFIG,
};

export function getReportUIConfig(type: ReportType): ReportUIConfig {
  return REPORT_UI_CONFIG[type] ?? DEFAULT_CONFIG;
}
