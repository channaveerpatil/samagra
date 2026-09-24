import * as React from 'react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import useNotificationCenter from '../hooks/useNotificationCenter';
import NotificationListItem from './NotificationListItem';
import NotificationEmptyState from './NotificationEmptyState';
import type { NotificationItem } from '../types';

const MENU_ID = 'notification-center-menu';
const MAX_MENU_HEIGHT = 420;

export interface NotificationBellProps {
  canPerformAction?: boolean;
  pendingActionReportId?: string | null;
  onAction?: (notification: NotificationItem) => void;
}

export default function NotificationBell({
  canPerformAction = false,
  pendingActionReportId = null,
  onAction,
}: NotificationBellProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, isMarkingAllAsRead } =
    useNotificationCenter();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      void markAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = () => {
    void markAllAsRead();
  };

  return (
    <React.Fragment>
      <Tooltip title="Notifications" enterDelay={1000}>
        <IconButton
          size="small"
          onClick={handleOpen}
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
          aria-controls={open ? MENU_ID : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Badge color="error" badgeContent={unreadCount} max={99}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        id={MENU_ID}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: { sx: { width: 380, maxWidth: '90vw' } },
          list: { sx: { p: 0 } },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}
        >
          <Stack spacing={0}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </Typography>
          </Stack>
          <Button
            size="small"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || isMarkingAllAsRead}
          >
            Mark all as read
          </Button>
        </Stack>
        <Divider />
        <Box sx={{ maxHeight: MAX_MENU_HEIGHT, overflowY: 'auto' }}>
          {isLoading ? (
            <Box sx={{ py: 5, px: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Loading notifications…
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <NotificationEmptyState hasNotifications={false} />
          ) : unreadCount === 0 ? (
            <NotificationEmptyState hasNotifications />
          ) : (
            <List dense disablePadding>
              {notifications
                .filter((notification) => !notification.isRead)
                .map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    {index > 0 ? <Divider component="li" /> : null}
                    <NotificationListItem
                      notification={notification}
                      onClick={handleNotificationClick}
                      canPerformAction={canPerformAction}
                      isActionPending={
                        !!notification.metadata?.reportId &&
                        notification.metadata.reportId === pendingActionReportId
                      }
                      onAction={onAction}
                    />
                  </React.Fragment>
                ))}
            </List>
          )}
        </Box>
      </Menu>
    </React.Fragment>
  );
}
