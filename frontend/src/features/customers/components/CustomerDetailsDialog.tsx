import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AppDialogFooter from '@/components/common/AppDialogFooter';
import useI18n from '@/hooks/useI18n';
import { LANGUAGE_LOCALES } from '@/lib/i18n/languages';
import type { Customer } from '../types';
import CustomerStatusChip from './CustomerStatusChip';

export interface CustomerDetailsDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function CustomerDetailsDialog({
  customer,
  onClose,
  onEdit,
}: CustomerDetailsDialogProps) {
  const { t, language } = useI18n();

  const detailFields = customer
    ? [
        { label: t('customers.details.email'), value: customer.email },
        { label: t('customers.details.phone'), value: customer.phone || '—' },
        { label: t('customers.details.company'), value: customer.company },
        { label: t('customers.details.customerId'), value: customer.id },
        {
          label: t('customers.details.created'),
          value: new Date(customer.createdAt).toLocaleDateString(LANGUAGE_LOCALES[language], {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      ]
    : [];

  return (
    <Dialog open={!!customer} onClose={onClose} maxWidth="xs" fullWidth>
      {customer ? (
        <>
          <AppDialogHeader
            icon={<PersonOutlineOutlinedIcon />}
            title={t('customers.details.title')}
            subtitle={customer.company}
            onClose={onClose}
          />
          <DialogContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ width: 56, height: 56 }}>{getInitials(customer.name)}</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {customer.name}
                  </Typography>
                  <CustomerStatusChip status={customer.status} />
                </Box>
              </Stack>
              <Divider />
              <Stack spacing={1.5}>
                {detailFields.map((field) => (
                  <Box key={field.label}>
                    <Typography variant="caption" color="text.secondary">
                      {field.label}
                    </Typography>
                    <Typography variant="body2">{field.value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </DialogContent>
          <AppDialogFooter>
            <Button onClick={onClose}>{t('common.close')}</Button>
            <Button variant="contained" onClick={() => onEdit(customer)}>
              {t('common.edit')}
            </Button>
          </AppDialogFooter>
        </>
      ) : null}
    </Dialog>
  );
}
