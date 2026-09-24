import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import { NOTIFICATION_TYPE_LABELS, type NotificationItem, type NotificationType } from '../types';
import { formatRelativeTime } from '../utils/formatRelativeTime';

const TYPE_COLOR: Record<NotificationType, 'info' | 'success' | 'error' | 'default'> = {
  APPROVAL: 'info',
  REPORT: 'success',
  SECURITY: 'error',
  SYSTEM: 'default',
};

export interface NotificationListItemProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
  canPerformAction?: boolean;
  isActionPending?: boolean;
  onAction?: (notification: NotificationItem) => void;
}

export default function NotificationListItem({
  notification,
  onClick,
  canPerformAction = false,
  isActionPending = false,
  onAction,
}: NotificationListItemProps) {
  const { isRead } = notification;

  const isDownloadAction =
    notification.actionType === 'DOWNLOAD_REPORT' && !!notification.metadata?.downloadAvailable;

  const handleActionClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onAction?.(notification);
  };

  return (
    <ListItemButton
      onClick={() => onClick(notification)}
      alignItems="flex-start"
      sx={{
        py: 1.25,
        px: 2,
        bgcolor: isRead ? 'transparent' : 'action.hover',
      }}
    >
      <Stack spacing={0.5} sx={{ width: '100%' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Chip
            label={NOTIFICATION_TYPE_LABELS[notification.type]}
            color={TYPE_COLOR[notification.type]}
            size="small"
            variant="outlined"
          />
          {isRead ? null : (
            <Box
              component="span"
              aria-label="Unread"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                flexShrink: 0,
              }}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: isRead ? 400 : 700 }}>
              {notification.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatRelativeTime(notification.createdAt)}
            </Typography>
          </Stack>
          {isDownloadAction && canPerformAction ? (
            <Tooltip title={`Download ${notification.title}`}>
              <span>
                <IconButton
                  size="small"
                  aria-label={`Download ${notification.title}`}
                  onClick={handleActionClick}
                  disabled={isActionPending}
                  sx={{ mt: 0.5 }}
                >
                  {isActionPending ? (
                    <CircularProgress size={18} />
                  ) : (
                    <DownloadIcon fontSize="small" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          ) : null}
        </Stack>
      </Stack>
    </ListItemButton>
  );
}
