import * as React from 'react';
import { Navigate, useLocation, Link as RouterLink } from 'react-router';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import useAuth from '@/hooks/useAuth';
import { appConfig } from '@/config/appConfig';

interface LocationState {
  from?: { pathname: string };
}

function CredentialsLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
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
        />
        <Box sx={{ textAlign: 'right' }}>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            Forgot password?
          </Link>
        </Box>
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
          Sign in
        </Button>
      </Stack>
    </Box>
  );
}

export default function LoginPage() {
  const { user, loginAsSuperAdmin, loginAsAdmin, loginAsManager, loginAsUser, loginAsViewer } =
    useAuth();
  const location = useLocation();

  if (user) {
    const state = location.state as LocationState | null;
    return <Navigate to={state?.from?.pathname ?? '/'} replace />;
  }

  if (!appConfig.features.useMockApi) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        <Paper variant="outlined" sx={{ width: '100%', maxWidth: 420, p: 4 }}>
          <Stack spacing={3}>
            <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Samagra
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to your dashboard
              </Typography>
            </Stack>
            <Divider />
            <CredentialsLoginForm />
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/signup">
                Sign up
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 420, p: 4 }}>
        <Stack spacing={3}>
          <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Samagra
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to your dashboard
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              This is a mock login for demonstration purposes. Choose a role to continue.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={loginAsSuperAdmin}
              fullWidth
            >
              Login as Super Admin
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<SupervisorAccountIcon />}
              onClick={loginAsAdmin}
              fullWidth
            >
              Login as Admin
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ManageAccountsIcon />}
              onClick={loginAsManager}
              fullWidth
            >
              Login as Manager
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PersonIcon />}
              onClick={loginAsUser}
              fullWidth
            >
              Login as User
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PersonOutlineIcon />}
              onClick={loginAsViewer}
              fullWidth
            >
              Login as Viewer
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/signup">
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
