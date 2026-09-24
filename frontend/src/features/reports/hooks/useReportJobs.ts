import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import {
  notificationsApi,
  notificationsQueryKeys,
} from '@/features/notifications/api/notificationsApi';
import { reportsApi, reportsQueryKeys } from '../api/reportsApi';
import type { ReportJob } from '../types';

const ACTIVE_POLL_INTERVAL_MS = 800;

function hasActiveJob(jobs: ReportJob[] | undefined): boolean {
  return !!jobs?.some((job) => job.status === 'QUEUED' || job.status === 'PROCESSING');
}

// Module-level, not component state: this hook remounts every time the
// Reports page is navigated to, and a per-mount ref would forget which jobs
// were already notified about, re-creating a notification for every
// already-completed job on each visit. This alone doesn't survive a full
// page reload though (it's just an in-memory Set) — the notifications query
// below is the source of truth that does survive a reload.
const notifiedJobIds = new Set<string>();

export default function useReportJobs() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: reportsQueryKeys.jobs(),
    queryFn: reportsApi.getReportJobs,
    refetchInterval: (query) => (hasActiveJob(query.state.data) ? ACTIVE_POLL_INTERVAL_MS : false),
  });

  // Shares its cache with the notification bell (same query key), so this
  // rarely triggers an extra network request.
  const { data: notifications } = useQuery({
    queryKey: notificationsQueryKeys.lists(),
    queryFn: notificationsApi.list,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useReportJobs] Failed to load report jobs', error);
      notify({ message: 'Failed to load report history', severity: 'error' });
    }
  }, [error, notify]);

  React.useEffect(() => {
    // Wait until we know what's already been notified about — otherwise a
    // fresh page load would create duplicates before the real list arrives.
    if (!notifications) return;

    const alreadyNotifiedReportIds = new Set(
      notifications
        .filter((notification) => notification.type === 'REPORT' && notification.metadata?.reportId)
        .map((notification) => notification.metadata!.reportId as string),
    );

    const newlyCompleted = jobs.filter(
      (job) =>
        job.status === 'COMPLETED' &&
        !notifiedJobIds.has(job.id) &&
        !alreadyNotifiedReportIds.has(job.id),
    );

    if (newlyCompleted.length === 0) return;

    newlyCompleted.forEach((job) => {
      notifiedJobIds.add(job.id);

      notificationsApi
        .create({
          type: 'REPORT',
          title: `${job.reportName} Ready`,
          message: `Your ${job.reportName} is ready to download.`,
          actionType: 'DOWNLOAD_REPORT',
          metadata: { reportId: job.id, downloadAvailable: true },
        })
        .then(() => queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.lists() }))
        .catch((notificationError) => {
          logger.error(
            `[useReportJobs] Failed to create notification for report job "${job.id}"`,
            notificationError,
          );
        });
    });
  }, [jobs, notifications, queryClient]);

  return { jobs, isLoading };
}
