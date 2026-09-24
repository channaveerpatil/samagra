export type ReportType = 'CUSTOMER' | 'SALES' | 'APPROVAL' | 'AUDIT' | 'USER' | 'PROJECT';

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

export const REPORT_JOB_STATUS_LABELS: Record<ReportJobStatus, string> = {
  QUEUED: 'Queued',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};
