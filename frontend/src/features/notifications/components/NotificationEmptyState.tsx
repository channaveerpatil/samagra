import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export interface NotificationEmptyStateProps {
  hasNotifications: boolean;
}

export default function NotificationEmptyState({ hasNotifications }: NotificationEmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5, px: 3 }}>
      <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
        {hasNotifications ? (
          <DoneAllIcon color="disabled" sx={{ fontSize: 32 }} />
        ) : (
          <NotificationsNoneIcon color="disabled" sx={{ fontSize: 32 }} />
        )}
        <Typography variant="body2" color="text.secondary">
          {hasNotifications ? "You're all caught up" : 'No notifications'}
        </Typography>
      </Stack>
    </Box>
  );
}
