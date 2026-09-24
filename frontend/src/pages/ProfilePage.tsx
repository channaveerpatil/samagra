import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import useAuth from '@/hooks/useAuth';
import useNotification from '@/hooks/useNotification';
import { ROLE_ACCESS_INFO } from '@/lib/auth/roleAccessInfo';

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

interface FormState {
  name: string;
  phone: string;
  company: string;
  website: string;
}

function userToFormState(name: string, phone: string, company: string, website: string): FormState {
  return { name, phone, company, website };
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { notify } = useNotification();

  const [form, setForm] = React.useState<FormState>(() =>
    userToFormState(user?.name ?? '', user?.phone ?? '', user?.company ?? '', user?.website ?? ''),
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [syncedUserId, setSyncedUserId] = React.useState(user?.id);

  if (user && user.id !== syncedUserId) {
    setSyncedUserId(user.id);
    setForm(userToFormState(user.name, user.phone, user.company, user.website));
  }

  const isDirty =
    !!user &&
    (form.name !== user.name ||
      form.phone !== user.phone ||
      form.company !== user.company ||
      form.website !== user.website);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !isDirty) return;

    setIsSubmitting(true);
    updateProfile({
      name: form.name.trim() || user.name,
      phone: form.phone.trim(),
      company: form.company.trim(),
      website: form.website.trim(),
    });
    notify({ message: 'Profile updated', severity: 'success' });
    setIsSubmitting(false);
  };

  const handleReset = () => {
    if (!user) return;
    setForm(userToFormState(user.name, user.phone, user.company, user.website));
  };

  const accessInfo = user ? ROLE_ACCESS_INFO[user.role] : null;

  return (
    <PageContainer
      title="Profile"
      description="Manage your personal details and see what your role gives you access to."
      breadcrumbs={[{ title: 'Profile' }]}
    >
      <Stack spacing={2}>
        <SectionCard title="Personal details">
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 72, height: 72, fontSize: 24 }}>
                {user ? getInitials(user.name) : ''}
              </Avatar>
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {user?.name}
                </Typography>
                <Chip label={accessInfo?.label ?? user?.role} size="small" color="primary" />
              </Stack>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <TextField
                label="Full name"
                value={form.name}
                onChange={handleChange('name')}
                fullWidth
              />
              <TextField
                label="Email address"
                value={user?.email ?? ''}
                fullWidth
                disabled
                helperText="Managed by your administrator"
              />
              <TextField
                label="Phone number"
                value={form.phone}
                onChange={handleChange('phone')}
                fullWidth
              />
              <TextField
                label="Company"
                value={form.company}
                onChange={handleChange('company')}
                fullWidth
              />
              <TextField
                label="Website"
                value={form.website}
                onChange={handleChange('website')}
                fullWidth
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
            </Box>

            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleReset} disabled={!isDirty || isSubmitting}>
                Reset
              </Button>
              <Button type="submit" variant="contained" disabled={!isDirty} loading={isSubmitting}>
                Save changes
              </Button>
            </Stack>
          </Box>
        </SectionCard>

        {accessInfo ? (
          <SectionCard title="Your access" description={accessInfo.summary}>
            <Stack spacing={1}>
              {accessInfo.capabilities.map((capability, index) => (
                <React.Fragment key={capability}>
                  {index > 0 ? <Divider /> : null}
                  <Typography variant="body2" sx={{ py: 0.5 }}>
                    {capability}
                  </Typography>
                </React.Fragment>
              ))}
            </Stack>
          </SectionCard>
        ) : null}
      </Stack>
    </PageContainer>
  );
}
