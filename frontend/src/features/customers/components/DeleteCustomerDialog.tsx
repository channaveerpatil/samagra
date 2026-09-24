import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AppDialogFooter from '@/components/common/AppDialogFooter';
import useI18n from '@/hooks/useI18n';
import type { Customer } from '../types';

export interface DeleteCustomerDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onConfirm: (customer: Customer) => Promise<void>;
}

export default function DeleteCustomerDialog({
  customer,
  onClose,
  onConfirm,
}: DeleteCustomerDialogProps) {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    if (!customer) return;
    setIsDeleting(true);
    try {
      await onConfirm(customer);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={!!customer} onClose={onClose} maxWidth="xs" fullWidth>
      <AppDialogHeader
        icon={<DeleteOutlinedIcon />}
        title={t('customers.deleteDialog.title')}
        color="error"
        onClose={onClose}
        closeDisabled={isDeleting}
      />
      <DialogContent>
        <DialogContentText sx={{ pt: 2 }}>
          {t('customers.deleteDialog.confirmPrefix')} <strong>{customer?.name}</strong>
          {t('customers.deleteDialog.confirmSuffix')}
        </DialogContentText>
      </DialogContent>
      <AppDialogFooter>
        <Button onClick={onClose} disabled={isDeleting}>
          {t('common.cancel')}
        </Button>
        <Button color="error" variant="contained" onClick={handleConfirm} loading={isDeleting}>
          {t('common.delete')}
        </Button>
      </AppDialogFooter>
    </Dialog>
  );
}
