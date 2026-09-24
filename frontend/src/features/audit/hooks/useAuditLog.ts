import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auditApi, auditQueryKeys } from '../api/auditApi';
import type { AuditLogEntry } from '../types';

export default function useAuditLog(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: auditQueryKeys.detail(id ?? ''),
    queryFn: () => auditApi.getAuditLog(id as string),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      const cached = queryClient.getQueryData<AuditLogEntry[]>(auditQueryKeys.lists());
      return cached?.find((entry) => entry.id === id);
    },
  });
}
