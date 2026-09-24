import * as React from 'react';
import Stack from '@mui/material/Stack';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import useAuditLogs from '@/features/audit/hooks/useAuditLogs';
import AuditFilters from '@/features/audit/components/AuditFilters';
import AuditTable from '@/features/audit/components/AuditTable';
import AuditDetailsDialog from '@/features/audit/components/AuditDetailsDialog';
import { isWithinAuditDateFilter } from '@/features/audit/utils/isWithinAuditDateFilter';
import type {
  AuditActionFilter,
  AuditActor,
  AuditActorFilter,
  AuditDateFilter,
  AuditModuleFilter,
} from '@/features/audit/types';

export default function AuditPage() {
  const { auditLogs, isLoading } = useAuditLogs();

  const [search, setSearch] = React.useState('');
  const [actorFilter, setActorFilter] = React.useState<AuditActorFilter>('ALL');
  const [actionFilter, setActionFilter] = React.useState<AuditActionFilter>('ALL');
  const [moduleFilter, setModuleFilter] = React.useState<AuditModuleFilter>('ALL');
  const [dateFilter, setDateFilter] = React.useState<AuditDateFilter>('ALL');
  const [selectedAuditLogId, setSelectedAuditLogId] = React.useState<string | null>(null);

  const actorOptions = React.useMemo<AuditActor[]>(() => {
    const seen = new Map<string, AuditActor>();
    auditLogs.forEach((entry) => seen.set(entry.actor.id, entry.actor));
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [auditLogs]);

  const hasFilters =
    search.trim() !== '' ||
    actorFilter !== 'ALL' ||
    actionFilter !== 'ALL' ||
    moduleFilter !== 'ALL' ||
    dateFilter !== 'ALL';

  const filteredAuditLogs = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return auditLogs.filter((entry) => {
      if (actorFilter !== 'ALL' && entry.actor.id !== actorFilter) return false;
      if (actionFilter !== 'ALL' && entry.action !== actionFilter) return false;
      if (moduleFilter !== 'ALL' && entry.module !== moduleFilter) return false;
      if (!isWithinAuditDateFilter(entry.createdAt, dateFilter)) return false;
      if (query) {
        const haystack = [entry.target, entry.description ?? '', entry.actor.name]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [auditLogs, search, actorFilter, actionFilter, moduleFilter, dateFilter]);

  const openDetails = (id: string) => setSelectedAuditLogId(id);
  const closeDetails = () => setSelectedAuditLogId(null);

  return (
    <PageContainer
      title="Audit & Activity"
      description="Track key actions performed across the application."
      breadcrumbs={[{ title: 'Audit & Activity' }]}
    >
      <SectionCard title="Audit records">
        <Stack spacing={2}>
          <AuditFilters
            search={search}
            onSearchChange={setSearch}
            actorFilter={actorFilter}
            onActorFilterChange={setActorFilter}
            actorOptions={actorOptions}
            actionFilter={actionFilter}
            onActionFilterChange={setActionFilter}
            moduleFilter={moduleFilter}
            onModuleFilterChange={setModuleFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />

          <AuditTable
            auditLogs={filteredAuditLogs}
            isLoading={isLoading}
            hasFilters={hasFilters}
            onView={(entry) => openDetails(entry.id)}
          />
        </Stack>
      </SectionCard>

      <AuditDetailsDialog auditLogId={selectedAuditLogId} onClose={closeDetails} />
    </PageContainer>
  );
}
