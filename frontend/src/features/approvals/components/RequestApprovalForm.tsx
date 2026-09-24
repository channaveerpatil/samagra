import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { APPROVAL_TYPE_LABELS, type ApprovalRequestInput, type ApprovalType } from '../types';

export interface RequestApprovalFormProps {
  onSubmit: (input: ApprovalRequestInput) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  title: string;
  description: string;
  type: ApprovalType;
  amount: string;
}

const EMPTY_FORM_STATE: FormState = {
  title: '',
  description: '',
  type: 'PURCHASE',
  amount: '',
};

const TYPE_OPTIONS: ApprovalType[] = ['PURCHASE', 'ACCESS', 'CUSTOMER_CHANGE', 'PROJECT', 'OTHER'];

type FormErrors = Partial<Record<'title' | 'description' | 'amount', string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  if (!form.description.trim()) errors.description = 'Description is required';
  if (form.amount.trim() && Number(form.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero';
  }
  return errors;
}

export default function RequestApprovalForm({ onSubmit, onCancel }: RequestApprovalFormProps) {
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM_STATE);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange =
    (field: 'title' | 'description' | 'amount') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({ ...previous, type: event.target.value as ApprovalType }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        amount: form.amount.trim() ? Number(form.amount) : undefined,
      });
      setForm(EMPTY_FORM_STATE);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: 560 }}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={form.title}
          onChange={handleChange('title')}
          error={!!errors.title}
          helperText={errors.title}
          size="small"
          fullWidth
          autoFocus
        />
        <TextField
          select
          label="Type"
          value={form.type}
          onChange={handleTypeChange}
          size="small"
          fullWidth
        >
          {TYPE_OPTIONS.map((type) => (
            <MenuItem key={type} value={type}>
              {APPROVAL_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          value={form.description}
          onChange={handleChange('description')}
          error={!!errors.description}
          helperText={errors.description}
          size="small"
          fullWidth
          multiline
          minRows={3}
        />
        <TextField
          label="Amount (optional)"
          type="number"
          value={form.amount}
          onChange={handleChange('amount')}
          error={!!errors.amount}
          helperText={errors.amount}
          size="small"
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onCancel} disabled={isSubmitting} size="small">
          Cancel
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting} size="small">
          Submit request
        </Button>
      </Stack>
    </Box>
  );
}
