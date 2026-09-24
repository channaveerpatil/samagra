import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';

export interface ApprovalEmptyStateProps {
  hasFilters: boolean;
}

export default function ApprovalEmptyState({ hasFilters }: ApprovalEmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, px: 3 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', maxWidth: 360 }}>
        <FactCheckOutlinedIcon color="disabled" sx={{ fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {hasFilters ? 'No approvals match the selected filters.' : 'No approval requests found.'}
        </Typography>
      </Stack>
    </Box>
  );
}
