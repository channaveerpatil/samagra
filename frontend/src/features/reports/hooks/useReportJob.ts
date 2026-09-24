import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reportsApi, reportsQueryKeys } from '../api/reportsApi';
import type { ReportJob } from '../types';

const ACTIVE_POLL_INTERVAL_MS = 800;

export default function useReportJob(id: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: reportsQueryKeys.job(id ?? ''),
    queryFn: () => reportsApi.getReportJob(id as string),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      const cached = queryClient.getQueryData<ReportJob[]>(reportsQueryKeys.jobs());
      return cached?.find((job) => job.id === id);
    },
    refetchInterval: (query) => {
      const job = query.state.data;
      return job && (job.status === 'QUEUED' || job.status === 'PROCESSING')
        ? ACTIVE_POLL_INTERVAL_MS
        : false;
    },
  });
}
