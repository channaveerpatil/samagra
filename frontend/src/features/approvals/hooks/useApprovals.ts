import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { approvalsApi, approvalsQueryKeys } from '../api/approvalsApi';

export default function useApprovals() {
  const { notify } = useNotification();

  const {
    data: approvals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: approvalsQueryKeys.lists(),
    queryFn: approvalsApi.getApprovals,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useApprovals] Failed to load approvals', error);
      notify({ message: 'Failed to load approval requests', severity: 'error' });
    }
  }, [error, notify]);

  return { approvals, isLoading, error };
}
