import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useColorScheme } from '@mui/material/styles';
import SectionCard from '@/components/common/SectionCard';

const MODES = [
  { id: 'light', label: 'Light', icon: <LightModeIcon /> },
  { id: 'dark', label: 'Dark', icon: <DarkModeIcon /> },
  { id: 'system', label: 'System', icon: <SettingsBrightnessIcon /> },
] as const;

export default function AppearanceSection() {
  const { mode, setMode } = useColorScheme();
  const activeMode = mode ?? 'system';

  return (
    <SectionCard
      title="Appearance"
      description="Choose how the interface looks. This also updates the theme toggle in the header."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {MODES.map((option) => (
          <ButtonBase
            key={option.id}
            onClick={() => setMode(option.id)}
            sx={{
              position: 'relative',
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: activeMode === option.id ? 'primary.main' : 'divider',
              justifyContent: 'flex-start',
            }}
          >
            <Stack spacing={1} sx={{ alignItems: 'flex-start', width: '100%' }}>
              {option.icon}
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {option.label}
              </Typography>
            </Stack>
            {activeMode === option.id ? (
              <CheckCircleIcon
                color="primary"
                fontSize="small"
                sx={{ position: 'absolute', top: 8, right: 8 }}
              />
            ) : null}
          </ButtonBase>
        ))}
      </Box>
    </SectionCard>
  );
}
