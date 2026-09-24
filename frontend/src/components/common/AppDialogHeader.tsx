import * as React from 'react';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { alpha, useTheme } from '@mui/material/styles';

export type AppDialogAccentColor = 'primary' | 'info' | 'success' | 'warning' | 'error';

export interface AppDialogHeaderProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  color?: AppDialogAccentColor;
  onClose?: () => void;
  closeDisabled?: boolean;
  titleId?: string;
}

// Shared header used by every dialog in the app: a colored icon badge, a
// title/subtitle block, and an optional close button. Keeping this in one
// place means every dialog (Customers, Approvals, Reports, ...) looks and
// behaves the same instead of each reimplementing its own DialogTitle.
export default function AppDialogHeader({
  icon,
  title,
  subtitle,
  color = 'primary',
  onClose,
  closeDisabled,
  titleId,
}: AppDialogHeaderProps) {
  const theme = useTheme();
  const accent = theme.palette[color].main;

  return (
    <>
      <DialogTitle
        id={titleId}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: onClose ? 7 : 3 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            flexShrink: 0,
            fontSize: 20,
            borderRadius: 1.5,
            color: accent,
            backgroundColor: alpha(accent, 0.14),
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {onClose ? (
          <IconButton
            aria-label="Close dialog"
            onClick={onClose}
            disabled={closeDisabled}
            sx={{ position: 'absolute', top: 12, right: 12 }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        ) : null}
      </DialogTitle>
      <Divider />
    </>
  );
}
