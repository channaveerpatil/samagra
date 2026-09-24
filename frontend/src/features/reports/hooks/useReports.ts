import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { reportsApi } from '../api/reportsApi';

export default function useReports() {
  const { notify } = useNotification();

  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: reportsApi.getReports,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useReports] Failed to load reports', error);
      notify({ message: 'Failed to load reports', severity: 'error' });
    }
  }, [error, notify]);

  return { reports, isLoading };
}
