import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { auditApi, auditQueryKeys } from '../api/auditApi';

export default function useAuditLogs() {
  const { notify } = useNotification();

  const {
    data: auditLogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: auditQueryKeys.lists(),
    queryFn: auditApi.getAuditLogs,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useAuditLogs] Failed to load audit logs', error);
      notify({ message: 'Failed to load audit logs', severity: 'error' });
    }
  }, [error, notify]);

  return { auditLogs, isLoading, error };
}
