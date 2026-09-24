import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { APPROVAL_TYPE_LABELS, type ApprovalTypeFilter } from '../types';

const TYPE_OPTIONS: ApprovalTypeFilter[] = [
  'ALL',
  'PURCHASE',
  'ACCESS',
  'CUSTOMER_CHANGE',
  'PROJECT',
  'OTHER',
];

export interface ApprovalFiltersProps {
  typeFilter: ApprovalTypeFilter;
  onTypeFilterChange: (type: ApprovalTypeFilter) => void;
}

export default function ApprovalFilters({ typeFilter, onTypeFilterChange }: ApprovalFiltersProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
      <TextField
        select
        label="Type"
        size="small"
        value={typeFilter}
        onChange={(event) => onTypeFilterChange(event.target.value as ApprovalTypeFilter)}
        sx={{ minWidth: 180 }}
      >
        {TYPE_OPTIONS.map((type) => (
          <MenuItem key={type} value={type}>
            {type === 'ALL' ? 'All' : APPROVAL_TYPE_LABELS[type]}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
