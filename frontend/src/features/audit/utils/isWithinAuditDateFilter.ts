import type { AuditDateFilter } from '../types';

const DATE_FILTER_MS: Record<Exclude<AuditDateFilter, 'ALL'>, number> = {
  '24H': 24 * 60 * 60 * 1000,
  '7D': 7 * 24 * 60 * 60 * 1000,
  '30D': 30 * 24 * 60 * 60 * 1000,
};

export function isWithinAuditDateFilter(createdAt: string, dateFilter: AuditDateFilter): boolean {
  if (dateFilter === 'ALL') return true;
  const age = Date.now() - new Date(createdAt).getTime();
  return age <= DATE_FILTER_MS[dateFilter];
}
