import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface ReportProgressProps {
  progress: number;
  label?: string;
}

export default function ReportProgress({
  progress,
  label = 'Generating report… (simulated progress)',
}: ReportProgressProps) {
  return (
    <Stack spacing={0.5} sx={{ minWidth: 160 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            aria-label="Report generation progress"
            aria-valuenow={progress}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32 }}>
          {progress}%
        </Typography>
      </Stack>
    </Stack>
  );
}
