import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme, type PaletteColor } from '@mui/material/styles';

export type SectionCardAccentColor = 'primary' | 'info' | 'success' | 'warning' | 'error';

export interface SectionCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  headerActions?: React.ReactNode;
  actions?: React.ReactNode;
  headerVariant?: 'plain' | 'gradient';
  accentColor?: SectionCardAccentColor;
}

export default function SectionCard({
  title,
  description,
  children,
  headerActions,
  actions,
  headerVariant = 'plain',
  accentColor = 'primary',
}: SectionCardProps) {
  const theme = useTheme();
  const isGradient = headerVariant === 'gradient';
  const palette: PaletteColor = theme.palette[accentColor];
  const headerTextColor = isGradient ? palette.dark : undefined;

  return (
    <Paper variant="outlined">
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          p: 3,
          ...(isGradient
            ? {
                backgroundImage: `linear-gradient(135deg, ${alpha(palette.light, 0.35)}, ${alpha(palette.main, 0.16)})`,
                color: headerTextColor,
                borderRadius: 'inherit',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }
            : {}),
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: headerTextColor }}>
            {title}
          </Typography>
          {description ? (
            <Typography
              variant="body2"
              sx={{ color: isGradient ? alpha(headerTextColor ?? '', 0.75) : 'text.secondary' }}
            >
              {description}
            </Typography>
          ) : null}
        </Stack>
        {headerActions ? <Box sx={{ flexShrink: 0 }}>{headerActions}</Box> : null}
      </Stack>
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {children}
      </Stack>
      {actions ? (
        <React.Fragment>
          <Divider />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', p: 2 }}>
            {actions}
          </Stack>
        </React.Fragment>
      ) : null}
    </Paper>
  );
}
