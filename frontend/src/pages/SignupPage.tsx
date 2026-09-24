import * as React from 'react';
import { Link as RouterLink, Navigate } from 'react-router';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunchOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import useAuth from '@/hooks/useAuth';
import { appConfig } from '@/config/appConfig';
import { getApiErrorMessage } from '@/lib/apiError';

const HIGHLIGHTS = [
  'Role-based access control out of the box',
  'Real-time approvals and audit trails',
  'Reporting and analytics your team can trust',
];

function BrandPanel() {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '45%',
        minHeight: '100vh',
        p: 6,
        color: 'primary.contrastText',
        background: (theme) =>
          `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.primary.light} 100%)`,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
        Samagra
      </Typography>

      <Stack spacing={3}>
        <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          Run your operations with confidence.
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Join the teams using Samagra to manage customers, approvals and reporting in one
          place.
        </Typography>
        <Stack spacing={1.5}>
          {HIGHLIGHTS.map((highlight) => (
            <Stack key={highlight} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <CheckCircleIcon fontSize="small" />
              <Typography variant="body2">{highlight}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', opacity: 0.85 }}>
        <RocketLaunchIcon fontSize="small" />
        <Typography variant="caption">Trusted by growing enterprise teams</Typography>
      </Stack>
    </Box>
  );
}

function SignupForm() {
  const { register } = useAuth();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password, company: company || undefined });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create account'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="First name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            fullWidth
          />
        </Stack>
        <TextField
          label="Company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          helperText="At least 8 characters"
        />
        <TextField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
          Create account
        </Button>
      </Stack>
    </Box>
  );
}

export default function SignupPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <BrandPanel />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appConfig.features.useMockApi
                  ? 'Demo mode: this creates a local session using sample data.'
                  : 'Get started with Samagra in a few seconds.'}
              </Typography>
            </Stack>

            <SignupForm />

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Sign in
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
