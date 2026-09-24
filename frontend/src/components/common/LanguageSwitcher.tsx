import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Typography from '@mui/material/Typography';
import useI18n from '@/hooks/useI18n';
import { LANGUAGES, LANGUAGE_CODES, LANGUAGE_LABELS, type Language } from '@/lib/i18n/languages';

const LANGUAGE_OPTIONS: Language[] = [LANGUAGES.en, LANGUAGES.kn];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Language" enterDelay={1000}>
        <div>
          <IconButton
            size="small"
            onClick={handleOpen}
            aria-label="Select language"
            aria-controls={open ? 'language-switcher-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              width: 36,
              height: 36,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {LANGUAGE_CODES[language]}
            </Typography>
          </IconButton>
        </div>
      </Tooltip>
      <Menu id="language-switcher-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        {LANGUAGE_OPTIONS.map((option) => (
          <MenuItem
            key={option}
            selected={option === language}
            onClick={() => handleSelect(option)}
          >
            <ListItemText>{LANGUAGE_LABELS[option]}</ListItemText>
            {option === language ? <CheckRoundedIcon fontSize="small" color="primary" /> : null}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
