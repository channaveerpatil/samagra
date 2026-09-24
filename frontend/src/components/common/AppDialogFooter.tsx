import * as React from 'react';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface AppDialogFooterProps {
  icon?: React.ReactNode;
  note?: React.ReactNode;
  children: React.ReactNode;
}

// Shared footer used by every dialog in the app: an optional helper note on
// the left (e.g. "Excel will be generated on completion") and the action
// buttons on the right, separated from the content by a divider.
export default function AppDialogFooter({ icon, note, children }: AppDialogFooterProps) {
  return (
    <>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: note ? 'space-between' : 'flex-end' }}>
        {note ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
            {icon}
            <Typography variant="caption">{note}</Typography>
          </Stack>
        ) : null}
        <Stack direction="row" spacing={1}>
          {children}
        </Stack>
      </DialogActions>
    </>
  );
}
