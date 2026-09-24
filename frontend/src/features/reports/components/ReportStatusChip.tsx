import Chip from '@mui/material/Chip';
import { REPORT_JOB_STATUS_LABELS, type ReportJobStatus } from '../types';

const STATUS_COLOR: Record<ReportJobStatus, 'default' | 'info' | 'success' | 'error'> = {
  QUEUED: 'default',
  PROCESSING: 'info',
  COMPLETED: 'success',
  FAILED: 'error',
};

export interface ReportStatusChipProps {
  status: ReportJobStatus;
}

export default function ReportStatusChip({ status }: ReportStatusChipProps) {
  return (
    <Chip label={REPORT_JOB_STATUS_LABELS[status]} color={STATUS_COLOR[status]} size="small" />
  );
}
