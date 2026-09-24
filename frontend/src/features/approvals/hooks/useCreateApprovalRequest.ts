import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { approvalsApi, approvalsQueryKeys } from '../api/approvalsApi';
import type { ApprovalRequestInput, UserReference } from '../types';

export default function useCreateApprovalRequest() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      requestedBy,
    }: {
      input: ApprovalRequestInput;
      requestedBy: UserReference;
    }) => approvalsApi.createApprovalRequest(input, requestedBy),
    onSuccess: async (approval) => {
      await queryClient.invalidateQueries({ queryKey: approvalsQueryKeys.lists() });
      notify({ message: `${approval.title} was submitted for approval`, severity: 'success' });
    },
    onError: () => {
      notify({ message: 'Failed to submit approval request', severity: 'error' });
    },
  });
}
