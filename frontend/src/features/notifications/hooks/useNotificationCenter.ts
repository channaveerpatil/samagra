import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { notificationsApi, notificationsQueryKeys } from '../api/notificationsApi';

export default function useNotificationCenter() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: notificationsQueryKeys.lists(),
    queryFn: notificationsApi.list,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useNotificationCenter] Failed to load notifications', error);
      notify({ message: 'Failed to load notifications', severity: 'error' });
    }
  }, [error, notify]);

  const unreadCount = React.useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const invalidateNotifications = React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.lists() }),
    [queryClient],
  );

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => invalidateNotifications(),
    onError: () => {
      notify({ message: 'Failed to update notification', severity: 'error' });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => invalidateNotifications(),
    onError: () => {
      notify({ message: 'Failed to mark notifications as read', severity: 'error' });
    },
  });

  const markAsRead = React.useCallback(
    (id: string) => markAsReadMutation.mutateAsync(id),
    [markAsReadMutation],
  );

  const markAllAsRead = React.useCallback(
    () => markAllAsReadMutation.mutateAsync(),
    [markAllAsReadMutation],
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
}
