import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { ROLES } from '@/lib/auth/roles';
import { ROLE_ACCESS_INFO } from '@/lib/auth/roleAccessInfo';
import type { UserFormValues } from './AddUserForm';

export interface UserAccessPreviewProps {
  values: UserFormValues;
}

function getInitials(firstName: string, lastName: string): string {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return initials || '?';
}

export default function UserAccessPreview({ values }: UserAccessPreviewProps) {
  const theme = useTheme();
  const info = ROLE_ACCESS_INFO[values.role];
  const accentColor = values.role === ROLES.SUPER_ADMIN ? 'primary' : 'info';
  const accent = theme.palette[accentColor].main;
  const accentLight = theme.palette[accentColor].light;
  const fullName = `${values.firstName} ${values.lastName}`.trim();

  return (
    <Box
      sx={{
        position: { md: 'sticky' },
        top: { md: 88 },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              fontWeight: 700,
              color: theme.palette.getContrastText(accent),
              backgroundImage: `linear-gradient(135deg, ${accentLight}, ${accent})`,
            }}
          >
            {getInitials(values.firstName, values.lastName)}
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
              {fullName || 'New user'}
            </Typography>
            <Chip
              label={info.label}
              size="small"
              sx={{
                mt: 0.5,
                width: 'fit-content',
                color: accent,
                backgroundColor: alpha(accent, 0.14),
                fontWeight: 600,
              }}
            />
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
            <EmailOutlinedIcon fontSize="small" />
            <Typography variant="body2" noWrap>
              {values.email || 'email@example.com'}
            </Typography>
          </Stack>
          {values.phone ? (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <PhoneOutlinedIcon fontSize="small" />
              <Typography variant="body2">{values.phone}</Typography>
            </Stack>
          ) : null}
          {values.company ? (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <BusinessOutlinedIcon fontSize="small" />
              <Typography variant="body2">{values.company}</Typography>
            </Stack>
          ) : null}
        </Stack>

        <Divider />

        <Stack spacing={0.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            What {info.label} can access
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {info.summary}
          </Typography>
        </Stack>

        <List dense disablePadding>
          {info.capabilities.map((capability) => (
            <ListItem key={capability} disableGutters sx={{ py: 0.4, alignItems: 'flex-start' }}>
              <CheckCircleOutlineIcon fontSize="small" color="success" sx={{ mr: 1, mt: 0.25 }} />
              <Typography variant="body2">{capability}</Typography>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  );
}
