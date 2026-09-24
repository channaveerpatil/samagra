import Chip from '@mui/material/Chip';
import useI18n from '@/hooks/useI18n';
import type { CustomerStatus } from '../types';

const STATUS_COLOR: Record<CustomerStatus, 'success' | 'default' | 'warning'> = {
  active: 'success',
  inactive: 'default',
  lead: 'warning',
};

export interface CustomerStatusChipProps {
  status: CustomerStatus;
}

export default function CustomerStatusChip({ status }: CustomerStatusChipProps) {
  const { t } = useI18n();
  return <Chip label={t(`customers.status.${status}`)} color={STATUS_COLOR[status]} />;
}
