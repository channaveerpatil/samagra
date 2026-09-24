import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { appConfig } from '@/config/appConfig';
import { approvalsApi, approvalsQueryKeys } from '../api/approvalsApi';
import {
  notificationsApi,
  notificationsQueryKeys,
} from '@/features/notifications/api/notificationsApi';

export default function useRejectApproval() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      approvalsApi.rejectApproval(id, comment),
    onSuccess: async (approval) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: approvalsQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: approvalsQueryKeys.detail(approval.id) }),
      ]);

      notify({ message: `${approval.title} was rejected`, severity: 'info' });

      // See useApproveApproval — the real backend already creates this
      // notification, correctly targeted at the requester.
      if (appConfig.features.useMockApprovalsApi) {
        try {
          await notificationsApi.create({
            type: 'APPROVAL',
            title: 'Approval decision',
            message: `Your ${approval.title} was rejected.`,
          });
          await queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.lists() });
        } catch (notificationError) {
          logger.error(
            '[useRejectApproval] Failed to create notification for approval',
            notificationError,
          );
        }
      }
    },
    onError: () => {
      notify({ message: 'Failed to reject request', severity: 'error' });
    },
  });
}
