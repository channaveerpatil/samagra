import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import {
  AUDIT_ACTION_LABELS,
  AUDIT_MODULE_LABELS,
  type AuditAction,
  type AuditActionFilter,
  type AuditActor,
  type AuditActorFilter,
  type AuditDateFilter,
  type AuditModule,
  type AuditModuleFilter,
} from '../types';

const ACTION_OPTIONS: AuditActionFilter[] = [
  'ALL',
  ...(Object.keys(AUDIT_ACTION_LABELS) as AuditAction[]),
];
const MODULE_OPTIONS: AuditModuleFilter[] = [
  'ALL',
  ...(Object.keys(AUDIT_MODULE_LABELS) as AuditModule[]),
];
const DATE_OPTIONS: { value: AuditDateFilter; label: string }[] = [
  { value: 'ALL', label: 'All time' },
  { value: '24H', label: 'Last 24 hours' },
  { value: '7D', label: 'Last 7 days' },
  { value: '30D', label: 'Last 30 days' },
];

export interface AuditFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  actorFilter: AuditActorFilter;
  onActorFilterChange: (actor: AuditActorFilter) => void;
  actorOptions: AuditActor[];
  actionFilter: AuditActionFilter;
  onActionFilterChange: (action: AuditActionFilter) => void;
  moduleFilter: AuditModuleFilter;
  onModuleFilterChange: (module: AuditModuleFilter) => void;
  dateFilter: AuditDateFilter;
  onDateFilterChange: (date: AuditDateFilter) => void;
}

export default function AuditFilters({
  search,
  onSearchChange,
  actorFilter,
  onActorFilterChange,
  actorOptions,
  actionFilter,
  onActionFilterChange,
  moduleFilter,
  onModuleFilterChange,
  dateFilter,
  onDateFilterChange,
}: AuditFiltersProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
      <TextField
        placeholder="Search by target, actor, or description"
        size="small"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{ minWidth: 260 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        select
        label="User"
        size="small"
        value={actorFilter}
        onChange={(event) => onActorFilterChange(event.target.value as AuditActorFilter)}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="ALL">All</MenuItem>
        {actorOptions.map((actor) => (
          <MenuItem key={actor.id} value={actor.id}>
            {actor.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Action"
        size="small"
        value={actionFilter}
        onChange={(event) => onActionFilterChange(event.target.value as AuditActionFilter)}
        sx={{ minWidth: 200 }}
      >
        {ACTION_OPTIONS.map((action) => (
          <MenuItem key={action} value={action}>
            {action === 'ALL' ? 'All' : AUDIT_ACTION_LABELS[action]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Module"
        size="small"
        value={moduleFilter}
        onChange={(event) => onModuleFilterChange(event.target.value as AuditModuleFilter)}
        sx={{ minWidth: 160 }}
      >
        {MODULE_OPTIONS.map((module) => (
          <MenuItem key={module} value={module}>
            {module === 'ALL' ? 'All' : AUDIT_MODULE_LABELS[module]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Date"
        size="small"
        value={dateFilter}
        onChange={(event) => onDateFilterChange(event.target.value as AuditDateFilter)}
        sx={{ minWidth: 160 }}
      >
        {DATE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
