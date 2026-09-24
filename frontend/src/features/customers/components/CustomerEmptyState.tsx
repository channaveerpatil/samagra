import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import useI18n from '@/hooks/useI18n';

export interface CustomerEmptyStateProps {
  hasSearchTerm: boolean;
  onAddCustomer: () => void;
  canAddCustomer: boolean;
}

export default function CustomerEmptyState({
  hasSearchTerm,
  onAddCustomer,
  canAddCustomer,
}: CustomerEmptyStateProps) {
  const { t } = useI18n();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, px: 3 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', maxWidth: 360 }}>
        <PersonAddAlt1Icon color="disabled" sx={{ fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {hasSearchTerm
            ? t('customers.emptyState.noMatchTitle')
            : t('customers.emptyState.noCustomersTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hasSearchTerm
            ? t('customers.emptyState.noMatchDescription')
            : t('customers.emptyState.noCustomersDescription')}
        </Typography>
        {!hasSearchTerm && canAddCustomer ? (
          <Button variant="contained" onClick={onAddCustomer} sx={{ mt: 1 }}>
            {t('customers.addCustomer')}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
