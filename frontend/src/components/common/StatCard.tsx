import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type StatCardColor = 'primary' | 'info' | 'success' | 'warning' | 'error';

export interface StatCardProps {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: React.ReactNode;
  caption?: React.ReactNode;
  color?: StatCardColor;
  variant?: 'outlined' | 'filled';
  iconAlign?: 'left' | 'right';
  sx?: SxProps<Theme>;
}

export default function StatCard({
  icon,
  value,
  label,
  caption,
  color = 'primary',
  variant = 'outlined',
  iconAlign = 'right',
  sx,
}: StatCardProps) {
  const theme = useTheme();
  const paletteColor = theme.palette[color];
  const filled = variant === 'filled';

  const iconBadge = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: filled ? 56 : 44,
        height: filled ? 56 : 44,
        borderRadius: (theme.vars ?? theme).shape.borderRadius,
        fontSize: filled ? 28 : 22,
        color: filled ? theme.palette.common.white : paletteColor.main,
        backgroundColor: filled
          ? alpha(theme.palette.common.white, 0.18)
          : alpha(paletteColor.main, 0.12),
      }}
    >
      {icon}
    </Box>
  );

  return (
    <Card
      variant={filled ? undefined : 'outlined'}
      sx={[
        {
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: iconAlign === 'right' ? 'space-between' : 'flex-start',
        },
        filled
          ? {
              color: theme.palette.common.white,
              backgroundColor: paletteColor.main,
              border: 'none',
            }
          : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {iconAlign === 'left' ? iconBadge : null}
      <Stack sx={{ minWidth: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: filled ? alpha(theme.palette.common.white, 0.85) : 'text.secondary' }}
        >
          {label}
        </Typography>
        {caption ? (
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'block',
              color: filled ? alpha(theme.palette.common.white, 0.7) : 'text.secondary',
            }}
          >
            {caption}
          </Typography>
        ) : null}
      </Stack>
      {iconAlign === 'right' ? iconBadge : null}
    </Card>
  );
}
