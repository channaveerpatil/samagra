import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

export interface FormTimelineSectionProps {
  index: number;
  title: string;
  description?: string;
  isLast?: boolean;
  children: React.ReactNode;
}

export default function FormTimelineSection({
  index,
  title,
  description,
  isLast = false,
  children,
}: FormTimelineSectionProps) {
  return (
    <Stack direction="row" spacing={1.5}>
      <Stack sx={{ alignItems: 'center', width: 26, flexShrink: 0 }}>
        <Box
          sx={(theme) => ({
            width: 26,
            height: 26,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 12,
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            flexShrink: 0,
          })}
        >
          {index}
        </Box>
        {!isLast ? (
          <Box
            sx={{
              flex: 1,
              width: 2,
              minHeight: 12,
              mt: 0.5,
              mb: 0.5,
              backgroundColor: 'divider',
            }}
          />
        ) : null}
      </Stack>
      <Box sx={{ flex: 1, pb: isLast ? 0 : 2, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {description}
          </Typography>
        ) : (
          <Box sx={{ mb: 0.5 }} />
        )}
        {children}
      </Box>
    </Stack>
  );
}
