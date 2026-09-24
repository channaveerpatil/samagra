import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router';
import ThemeSwitcher from '@/components/common/ThemeSwitcher';
import UserMenu from '@/components/common/UserMenu';
import NotificationBell from '@/features/notifications/components/NotificationBell';
import { featureFlags } from '@/config/featureFlags';
import useAuth from '@/hooks/useAuth';
import { PERMISSIONS } from '@/lib/auth/permissions';
import useDownloadReport from '@/features/reports/hooks/useDownloadReport';
import type { NotificationItem } from '@/features/notifications/types';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1,
}));

export interface HeaderProps {
  title: string;
  menuOpen: boolean;
  onToggleMenu: (open: boolean) => void;
}

const DEVANAGARI_PATTERN = /[ऀ-ॿ]+/;

export default function Header({ title, menuOpen, onToggleMenu }: HeaderProps) {
  const theme = useTheme();
  const { can } = useAuth();
  const devanagariMatch = title.match(DEVANAGARI_PATTERN);
  const brandMark = devanagariMatch?.[0] ?? null;
  const brandName = brandMark ? title.replace(brandMark, '').trim() : title;
  const canDownloadReport = featureFlags.reporting && can(PERMISSIONS.REPORT_DOWNLOAD);
  const downloadReportMutation = useDownloadReport();

  const handleNotificationAction = React.useCallback(
    (notification: NotificationItem) => {
      const reportId = notification.metadata?.reportId;
      if (notification.actionType === 'DOWNLOAD_REPORT' && reportId) {
        downloadReportMutation.mutate(reportId);
      }
    },
    [downloadReportMutation],
  );

  const handleMenuOpen = React.useCallback(() => {
    onToggleMenu(!menuOpen);
  }, [menuOpen, onToggleMenu]);

  const getMenuIcon = React.useCallback(
    (isExpanded: boolean) => {
      const expandMenuActionText = 'Expand';
      const collapseMenuActionText = 'Collapse';

      return (
        <Tooltip
          title={`${isExpanded ? collapseMenuActionText : expandMenuActionText} menu`}
          enterDelay={1000}
        >
          <div>
            <IconButton
              size="small"
              aria-label={`${isExpanded ? collapseMenuActionText : expandMenuActionText} navigation menu`}
              onClick={handleMenuOpen}
            >
              {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </Tooltip>
      );
    },
    [handleMenuOpen],
  );

  return (
    <AppBar color="inherit" position="absolute" sx={{ displayPrint: 'none' }}>
      <Toolbar sx={{ backgroundColor: 'inherit', mx: { xs: -0.75, sm: -1 } }}>
        <Stack direction="row" sx={{ alignItems: 'center', width: '100%' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
            {getMenuIcon(menuOpen)}
            <MuiLink component={RouterLink} to="/" underline="none">
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: (theme.vars ?? theme).palette.primary.main,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}
                >
                  {brandName}
                </Typography>
                {brandMark ? (
                  <Typography
                    sx={{
                      fontFamily: '"IBM Plex Sans Devanagari", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: '#E8A33D',
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                    }}
                  >
                    {brandMark}
                  </Typography>
                ) : null}
              </Stack>
            </MuiLink>
          </Stack>
          <TextField
            size="small"
            placeholder="Search…"
            aria-label="Search"
            sx={{
              ml: { xs: 2, sm: 4 },
              display: { xs: 'none', sm: 'block' },
              width: '100%',
              maxWidth: 320,
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexShrink: 0, marginLeft: 'auto' }}
          >
            {featureFlags.notifications ? (
              <NotificationBell
                canPerformAction={canDownloadReport}
                pendingActionReportId={
                  downloadReportMutation.isPending
                    ? (downloadReportMutation.variables ?? null)
                    : null
                }
                onAction={handleNotificationAction}
              />
            ) : null}
            <ThemeSwitcher />
            <UserMenu />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
