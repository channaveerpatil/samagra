import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { reportsApi, reportsQueryKeys } from '../api/reportsApi';
import type { ReportType } from '../types';

export default function useGenerateReport() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportType: ReportType) => reportsApi.generateReport(reportType),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: reportsQueryKeys.jobs() });
      notify({ message: `Generating ${job.reportName}…`, severity: 'info' });
    },
    onError: () => {
      notify({ message: 'Failed to start report generation', severity: 'error' });
    },
  });
}
