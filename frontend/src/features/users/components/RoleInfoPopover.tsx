import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { Role } from '@/lib/auth/roles';
import { ROLE_ACCESS_INFO } from '@/lib/auth/roleAccessInfo';

export interface RoleInfoPopoverProps {
  role: Role;
}

export default function RoleInfoPopover({ role }: RoleInfoPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const info = ROLE_ACCESS_INFO[role];
  const open = !!anchorEl;

  return (
    <>
      <IconButton
        size="small"
        aria-label={`What does ${info.label} access include?`}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <InfoOutlinedIcon fontSize="small" color="action" />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: 320 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {info.label} access
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
            {info.summary}
          </Typography>
          <List dense disablePadding>
            {info.capabilities.map((capability) => (
              <ListItem key={capability} disableGutters sx={{ py: 0.25, alignItems: 'flex-start' }}>
                <CheckCircleOutlineIcon
                  fontSize="small"
                  color="success"
                  sx={{ mr: 1, mt: 0.25 }}
                />
                <Typography variant="body2">{capability}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}
