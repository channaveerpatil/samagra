import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AppDialogFooter from '@/components/common/AppDialogFooter';
import useI18n from '@/hooks/useI18n';
import type { TranslationKey } from '@/context/I18nContext';
import { type Customer, type CustomerInput, type CustomerStatus } from '../types';

export interface CustomerFormDialogProps {
  open: boolean;
  customer?: Customer;
  onClose: () => void;
  onSubmit: (input: CustomerInput) => Promise<void>;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
}

const EMPTY_FORM_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'lead',
};

const STATUS_OPTIONS: CustomerStatus[] = ['active', 'inactive', 'lead'];

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState, t: (key: TranslationKey) => string): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = t('customers.form.nameRequired');
  if (!form.email.trim()) {
    errors.email = t('customers.form.emailRequired');
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = t('customers.form.emailInvalid');
  }
  if (!form.company.trim()) errors.company = t('customers.form.companyRequired');
  return errors;
}

function customerToFormState(customer?: Customer): FormState {
  if (!customer) return EMPTY_FORM_STATE;
  return {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
    status: customer.status,
  };
}

interface CustomerFormFieldsProps {
  customer?: Customer;
  onClose: () => void;
  onSubmit: (input: CustomerInput) => Promise<void>;
}

function CustomerFormFields({ customer, onClose, onSubmit }: CustomerFormFieldsProps) {
  const { t } = useI18n();
  const [form, setForm] = React.useState<FormState>(() => customerToFormState(customer));
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!customer;

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(form, t);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <AppDialogHeader
        icon={isEditing ? <EditOutlinedIcon /> : <PersonAddAlt1Icon />}
        title={isEditing ? t('customers.form.editTitle') : t('customers.form.addTitle')}
        subtitle={isEditing ? t('customers.form.editSubtitle') : t('customers.form.addSubtitle')}
        onClose={onClose}
        closeDisabled={isSubmitting}
      />
      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            pt: 1,
          }}
        >
          <TextField
            label={t('customers.form.name')}
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            autoFocus
          />
          <TextField
            label={t('customers.form.email')}
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            label={t('customers.form.phone')}
            value={form.phone}
            onChange={handleChange('phone')}
            fullWidth
          />
          <TextField
            label={t('customers.form.company')}
            value={form.company}
            onChange={handleChange('company')}
            error={!!errors.company}
            helperText={errors.company}
            fullWidth
          />
          <TextField
            select
            label={t('customers.form.status')}
            value={form.status}
            onChange={handleChange('status')}
            fullWidth
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {t(`customers.status.${status}`)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <AppDialogFooter>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {isEditing ? t('common.saveChanges') : t('customers.addCustomer')}
        </Button>
      </AppDialogFooter>
    </Box>
  );
}

export default function CustomerFormDialog({
  open,
  customer,
  onClose,
  onSubmit,
}: CustomerFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {open ? (
        <CustomerFormFields
          key={customer?.id ?? 'new'}
          customer={customer}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      ) : null}
    </Dialog>
  );
}
