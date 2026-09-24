import Typography from '@mui/material/Typography';
import PageContainer from '@/components/layout/PageContainer';

export default function NotFoundPage() {
  return (
    <PageContainer title="Page not found">
      <Typography>The page you're looking for doesn't exist.</Typography>
    </PageContainer>
  );
}
