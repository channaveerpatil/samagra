import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { appConfig } from '@/config/appConfig';
import { approvalsApi, approvalsQueryKeys } from '../api/approvalsApi';
import {
  notificationsApi,
  notificationsQueryKeys,
} from '@/features/notifications/api/notificationsApi';

export default function useApproveApproval() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      approvalsApi.approveApproval(id, comment),
    onSuccess: async (approval) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: approvalsQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: approvalsQueryKeys.detail(approval.id) }),
      ]);

      notify({ message: `${approval.title} was approved`, severity: 'success' });

      // The real backend creates this notification itself, correctly targeted
      // at the original requester rather than whoever is currently logged in
      // (i.e. the approver). Only do it client-side in mock mode, where
      // notifications aren't scoped to a specific user yet.
      if (appConfig.features.useMockApprovalsApi) {
        try {
          await notificationsApi.create({
            type: 'APPROVAL',
            title: 'Approval decision',
            message: `Your ${approval.title} was approved.`,
          });
          await queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.lists() });
        } catch (notificationError) {
          logger.error(
            '[useApproveApproval] Failed to create notification for approval',
            notificationError,
          );
        }
      }
    },
    onError: () => {
      notify({ message: 'Failed to approve request', severity: 'error' });
    },
  });
}
