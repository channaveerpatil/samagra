import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router';
import PageContainer from '@/components/layout/PageContainer';

export default function AccessDeniedPage() {
  return (
    <PageContainer title="Access denied">
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Typography color="text.secondary">
          You do not have permission to access this page.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to Dashboard
        </Button>
      </Stack>
    </PageContainer>
  );
}
