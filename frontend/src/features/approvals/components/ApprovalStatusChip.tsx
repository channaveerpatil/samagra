import Chip from '@mui/material/Chip';
import { APPROVAL_STATUS_LABELS, type ApprovalStatus } from '../types';

const STATUS_COLOR: Record<ApprovalStatus, 'warning' | 'success' | 'error'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

export interface ApprovalStatusChipProps {
  status: ApprovalStatus;
}

export default function ApprovalStatusChip({ status }: ApprovalStatusChipProps) {
  return <Chip label={APPROVAL_STATUS_LABELS[status]} color={STATUS_COLOR[status]} size="small" />;
}
