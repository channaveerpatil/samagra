import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { ROLES, type Role } from '@/lib/auth/roles';
import { ROLE_ACCESS_INFO } from '@/lib/auth/roleAccessInfo';
import RoleInfoPopover from './RoleInfoPopover';
import FormTimelineSection from './FormTimelineSection';
import type { User, UserInput } from '../types';

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone: string;
  company: string;
}

export interface AddUserFormProps {
  user?: User;
  onSubmit: (input: UserInput) => Promise<void>;
  onCancel: () => void;
  onChange?: (values: UserFormValues) => void;
}

type FormState = UserFormValues;

const EMPTY_FORM_STATE: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  role: ROLES.USER,
  phone: '',
  company: '',
};

const ROLE_OPTIONS: Role[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.USER,
  ROLES.VIEWER,
];

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}

function userToFormState(user?: User): FormState {
  if (!user) return EMPTY_FORM_STATE;
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone ?? '',
    company: user.company ?? '',
  };
}

export default function AddUserForm({ user, onSubmit, onCancel, onChange }: AddUserFormProps) {
  const isEditing = !!user;
  const [form, setForm] = React.useState<FormState>(() => userToFormState(user));
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    onChange?.(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleChange =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({ ...previous, role: event.target.value as Role }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        role: form.role,
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
      });
      if (!isEditing) {
        setForm(EMPTY_FORM_STATE);
        setErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: 560 }}>
      <FormTimelineSection index={1} title="Personal details">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.5,
          }}
        >
          <TextField
            label="First name"
            value={form.firstName}
            onChange={handleChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
            size="small"
            fullWidth
            autoFocus
          />
          <TextField
            label="Last name"
            value={form.lastName}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            size="small"
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            size="small"
            fullWidth
            sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
          />
        </Box>
      </FormTimelineSection>

      <FormTimelineSection index={2} title="Role & access">
        <RadioGroup value={form.role} onChange={handleRoleChange}>
          <Stack spacing={1}>
            {ROLE_OPTIONS.map((role) => {
              const info = ROLE_ACCESS_INFO[role];
              const selected = form.role === role;
              return (
                <Box
                  key={role}
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    border: 1,
                    borderRadius: 1.5,
                    borderColor: selected ? 'primary.main' : 'divider',
                    backgroundColor: selected
                      ? alpha(theme.palette.primary.main, 0.06)
                      : 'transparent',
                    pl: 1,
                    pr: 0.5,
                    py: 0.25,
                    transition: 'border-color 150ms ease, background-color 150ms ease',
                  })}
                >
                  <FormControlLabel
                    value={role}
                    control={<Radio size="small" />}
                    sx={{ flex: 1, mr: 0 }}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {info.label}
                      </Typography>
                    }
                  />
                  <RoleInfoPopover role={role} />
                </Box>
              );
            })}
          </Stack>
        </RadioGroup>
      </FormTimelineSection>

      <FormTimelineSection index={3} title="Contact details" isLast>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.5,
          }}
        >
          <TextField
            label="Phone"
            value={form.phone}
            onChange={handleChange('phone')}
            size="small"
            fullWidth
          />
          <TextField
            label="Company"
            value={form.company}
            onChange={handleChange('company')}
            size="small"
            fullWidth
          />
        </Box>
      </FormTimelineSection>

      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 1 }}>
        <Button onClick={onCancel} disabled={isSubmitting} size="small">
          Cancel
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting} size="small">
          {isEditing ? 'Save changes' : 'Add user'}
        </Button>
      </Stack>
    </Box>
  );
}
