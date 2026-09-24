import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SectionCard from '@/components/common/SectionCard';
import useI18n from '@/hooks/useI18n';
import { LANGUAGES, LANGUAGE_LABELS, type Language } from '@/lib/i18n/languages';

const LANGUAGE_OPTIONS: Language[] = [LANGUAGES.en, LANGUAGES.kn];

export default function GeneralSection() {
  const { language, setLanguage } = useI18n();

  return (
    <SectionCard title="General" description="Basic preferences for how the app behaves for you.">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <TextField
          select
          label="Language"
          value={language}
          onChange={(event) => setLanguage(event.target.value as Language)}
          fullWidth
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {LANGUAGE_LABELS[option]}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </SectionCard>
  );
}
