import { useQuery, useQueryClient } from '@tanstack/react-query';
import { approvalsApi, approvalsQueryKeys } from '../api/approvalsApi';
import type { ApprovalRequest } from '../types';

export default function useApproval(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: approvalsQueryKeys.detail(id ?? ''),
    queryFn: () => approvalsApi.getApproval(id as string),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      const cached = queryClient.getQueryData<ApprovalRequest[]>(approvalsQueryKeys.lists());
      return cached?.find((approval) => approval.id === id);
    },
  });
}
