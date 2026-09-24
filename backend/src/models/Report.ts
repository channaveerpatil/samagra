export type ReportType = 'CUSTOMER' | 'USER';

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  type: ReportType;
}

export type ReportJobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ReportJob {
  id: string;
  reportType: ReportType;
  reportName: string;
  status: ReportJobStatus;
  createdAt: string;
  completedAt?: string;
  fileName?: string;
  progress?: number;
  errorMessage?: string;
}

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: 'rpt_customer',
    name: 'Customer Overview',
    description: 'Customer growth, status and activity.',
    type: 'CUSTOMER',
  },
  {
    id: 'rpt_user',
    name: 'User & Access Overview',
    description: 'Users, roles and access distribution.',
    type: 'USER',
  },
];
