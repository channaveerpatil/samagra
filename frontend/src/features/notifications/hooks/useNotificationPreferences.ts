import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { notificationsApi, notificationsQueryKeys } from '../api/notificationsApi';
import type { NotificationPreferences } from '../types';

export default function useNotificationPreferences() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const {
    data: preferences,
    isLoading,
    error,
  } = useQuery({
    queryKey: notificationsQueryKeys.preferences(),
    queryFn: notificationsApi.getPreferences,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useNotificationPreferences] Failed to load preferences', error);
      notify({ message: 'Failed to load notification preferences', severity: 'error' });
    }
  }, [error, notify]);

  const updateMutation = useMutation({
    mutationFn: (update: Partial<NotificationPreferences>) =>
      notificationsApi.updatePreferences(update),
    onSuccess: (updated) => {
      queryClient.setQueryData(notificationsQueryKeys.preferences(), updated);
    },
    onError: () => {
      notify({ message: 'Failed to update notification preferences', severity: 'error' });
    },
  });

  const updatePreferences = React.useCallback(
    (update: Partial<NotificationPreferences>) => updateMutation.mutateAsync(update),
    [updateMutation],
  );

  return {
    preferences,
    isLoading,
    updatePreferences,
    isUpdating: updateMutation.isPending,
  };
}
