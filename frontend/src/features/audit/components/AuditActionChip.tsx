import Chip from '@mui/material/Chip';
import { AUDIT_ACTION_LABELS, type AuditAction } from '../types';

const ACTION_COLOR: Record<AuditAction, 'info' | 'warning' | 'success' | 'error' | 'default'> = {
  USER_CREATED: 'info',
  USER_ROLE_CHANGED: 'warning',
  CUSTOMER_CREATED: 'info',
  APPROVAL_APPROVED: 'success',
  APPROVAL_REJECTED: 'error',
  REPORT_GENERATED: 'default',
  REPORT_DOWNLOADED: 'default',
};

export interface AuditActionChipProps {
  action: AuditAction;
}

export default function AuditActionChip({ action }: AuditActionChipProps) {
  return <Chip label={AUDIT_ACTION_LABELS[action]} color={ACTION_COLOR[action]} size="small" />;
}
