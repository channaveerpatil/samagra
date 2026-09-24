import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export interface ReportEmptyStateProps {
  canGenerate: boolean;
  onGenerate: () => void;
}

export default function ReportEmptyState({ canGenerate, onGenerate }: ReportEmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6, px: 3 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', maxWidth: 360 }}>
        <DescriptionOutlinedIcon color="disabled" sx={{ fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          No reports generated yet.
        </Typography>
        {canGenerate ? (
          <Button variant="contained" onClick={onGenerate} sx={{ mt: 1 }}>
            Generate Report
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
