import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

export interface AuditEmptyStateProps {
  hasFilters: boolean;
}

export default function AuditEmptyState({ hasFilters }: AuditEmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, px: 3 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', maxWidth: 360 }}>
        <HistoryOutlinedIcon color="disabled" sx={{ fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {hasFilters ? 'No audit records match the selected filters.' : 'No audit records found.'}
        </Typography>
      </Stack>
    </Box>
  );
}
