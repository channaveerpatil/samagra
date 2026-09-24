import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { alpha } from '@mui/material/styles';
import type { ApprovalStatusFilter } from '../types';

export interface ApprovalStatusTabsProps {
  statusFilter: ApprovalStatusFilter;
  onStatusFilterChange: (status: ApprovalStatusFilter) => void;
  counts: Record<ApprovalStatusFilter, number>;
}

const TABS: { value: ApprovalStatusFilter; label: string; icon: React.ReactElement }[] = [
  { value: 'ALL', label: 'All', icon: <ListAltOutlinedIcon /> },
  { value: 'PENDING', label: 'Pending', icon: <PendingActionsOutlinedIcon /> },
  { value: 'APPROVED', label: 'Approved', icon: <CheckCircleOutlinedIcon /> },
  { value: 'REJECTED', label: 'Rejected', icon: <CancelOutlinedIcon /> },
];

function TabLabel({ label, count }: { label: string; count: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      {count > 0 ? (
        <Box
          component="span"
          sx={(theme) => ({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 20,
            height: 20,
            px: 0.5,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            color: theme.palette.primary.dark,
            backgroundColor: alpha(theme.palette.primary.main, 0.14),
          })}
        >
          {count > 99 ? '99+' : count}
        </Box>
      ) : null}
    </Box>
  );
}

export default function ApprovalStatusTabs({
  statusFilter,
  onStatusFilterChange,
  counts,
}: ApprovalStatusTabsProps) {
  return (
    <Tabs
      value={statusFilter}
      onChange={(_event, value) => onStatusFilterChange(value as ApprovalStatusFilter)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        minHeight: 44,
        '& .MuiTab-root': {
          minHeight: 44,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          icon={tab.icon}
          iconPosition="start"
          label={<TabLabel label={tab.label} count={counts[tab.value]} />}
        />
      ))}
    </Tabs>
  );
}
