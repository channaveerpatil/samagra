import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        displayPrint: 'none',
        px: 2,
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {`© ${new Date().getFullYear()} Samagra. All rights reserved.`}
      </Typography>
      <LanguageSwitcher />
    </Box>
  );
}
