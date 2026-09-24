import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { alpha, lighten, useTheme } from '@mui/material/styles';
import { getReportUIConfig } from '../reportRegistry';
import type { ReportDefinition } from '../types';

export interface ReportDefinitionCardProps {
  report: ReportDefinition;
  onOpen: (report: ReportDefinition) => void;
}

export default function ReportDefinitionCard({ report, onOpen }: ReportDefinitionCardProps) {
  const theme = useTheme();
  const { icon, color } = getReportUIConfig(report.type);
  const accent = theme.palette[color].main;
  // In dark mode the theme's `.light` shade is tuned to stay legible as text/
  // icon color on a dark surface, not to be a bright gradient tint, so it sits
  // too close to `.main` and reads as flat/muddy. Compute a properly lightened
  // stop instead of relying on the token in that mode.
  const accentLight =
    theme.palette.mode === 'dark' ? lighten(accent, 0.35) : theme.palette[color].light;

  return (
    <Paper
      variant="outlined"
      component={ButtonBase}
      onClick={() => onOpen(report)}
      aria-label={`Configure ${report.name}`}
      sx={{
        display: 'flex',
        width: '100%',
        textAlign: 'left',
        p: 2.5,
        borderRadius: 2,
        borderColor: 'divider',
        transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
        '&:hover': {
          borderColor: accent,
          boxShadow: `0 8px 20px ${alpha(accent, 0.16)}`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Stack spacing={2.5} sx={{ width: '100%', height: '100%', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
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
              color: theme.palette.getContrastText(accent),
              backgroundImage: `linear-gradient(135deg, ${accentLight}, ${accent})`,
              boxShadow: `0 4px 10px ${alpha(accent, 0.35)}`,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>
            {report.description}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {report.name}
          </Typography>
          <IconButton
            size="small"
            tabIndex={-1}
            aria-hidden
            sx={{
              border: 1,
              borderColor: alpha(accent, 0.4),
              color: accent,
              borderRadius: 1.5,
            }}
          >
            <ArrowForwardRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
