import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from 'react-router';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import useAuth from '@/hooks/useAuth';
import { PERMISSIONS } from '@/lib/auth/permissions';
import useApprovals from '@/features/approvals/hooks/useApprovals';
import useApproveApproval from '@/features/approvals/hooks/useApproveApproval';
import useRejectApproval from '@/features/approvals/hooks/useRejectApproval';
import ApprovalFilters from '@/features/approvals/components/ApprovalFilters';
import ApprovalStatusTabs from '@/features/approvals/components/ApprovalStatusTabs';
import ApprovalTable from '@/features/approvals/components/ApprovalTable';
import ApprovalDetailsDialog from '@/features/approvals/components/ApprovalDetailsDialog';
import ApprovalActionDialog, {
  type ApprovalActionMode,
} from '@/features/approvals/components/ApprovalActionDialog';
import type {
  ApprovalRequest,
  ApprovalStatusFilter,
  ApprovalsNavigationState,
  ApprovalTypeFilter,
} from '@/features/approvals/types';

interface ActionDialogState {
  approval: ApprovalRequest;
  mode: ApprovalActionMode;
}

export default function ApprovalsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as ApprovalsNavigationState | null;
  const { user, can } = useAuth();
  const canApprove = can(PERMISSIONS.APPROVAL_APPROVE);
  const canReject = can(PERMISSIONS.APPROVAL_REJECT);
  const canCreate = can(PERMISSIONS.APPROVAL_CREATE);
  // Only reviewers (Super Admin / Admin / Manager) see every request — a
  // plain user would otherwise see everyone else's approvals, so they're
  // scoped down to just the requests they submitted themselves.
  const canReviewAll = canApprove || canReject;

  const { approvals, isLoading } = useApprovals();
  const approveMutation = useApproveApproval();
  const rejectMutation = useRejectApproval();

  const [statusFilter, setStatusFilter] = React.useState<ApprovalStatusFilter>(
    navigationState?.statusFilter ?? 'PENDING',
  );
  const [typeFilter, setTypeFilter] = React.useState<ApprovalTypeFilter>('ALL');
  const [selectedApprovalId, setSelectedApprovalId] = React.useState<string | null>(
    navigationState?.approvalId ?? null,
  );
  const [actionDialog, setActionDialog] = React.useState<ActionDialogState | null>(null);

  const visibleApprovals = React.useMemo(() => {
    if (canReviewAll || !user) return approvals;
    return approvals.filter((approval) => approval.requestedBy.id === user.id);
  }, [approvals, canReviewAll, user]);

  const statusCounts = React.useMemo<Record<ApprovalStatusFilter, number>>(
    () => ({
      ALL: visibleApprovals.length,
      PENDING: visibleApprovals.filter((approval) => approval.status === 'PENDING').length,
      APPROVED: visibleApprovals.filter((approval) => approval.status === 'APPROVED').length,
      REJECTED: visibleApprovals.filter((approval) => approval.status === 'REJECTED').length,
    }),
    [visibleApprovals],
  );

  const hasFilters = statusFilter !== 'ALL' || typeFilter !== 'ALL';

  const filteredApprovals = React.useMemo(() => {
    return visibleApprovals.filter((approval) => {
      if (statusFilter !== 'ALL' && approval.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && approval.type !== typeFilter) return false;
      return true;
    });
  }, [visibleApprovals, statusFilter, typeFilter]);

  const openDetails = (approval: ApprovalRequest) => setSelectedApprovalId(approval.id);
  const closeDetails = () => setSelectedApprovalId(null);

  const openAction = (approval: ApprovalRequest, mode: ApprovalActionMode) =>
    setActionDialog({ approval, mode });
  const closeAction = () => setActionDialog(null);

  const isActionSubmitting = approveMutation.isPending || rejectMutation.isPending;

  const handleConfirmAction = async (comment: string | undefined) => {
    if (!actionDialog) return;
    const { approval, mode } = actionDialog;

    if (mode === 'approve') {
      await approveMutation.mutateAsync({ id: approval.id, comment });
    } else {
      await rejectMutation.mutateAsync({ id: approval.id, comment });
    }

    closeAction();
    closeDetails();
  };

  return (
    <PageContainer
      title="Approvals"
      description={
        canReviewAll
          ? 'Review and decide on pending approval requests.'
          : 'Track the approval requests you have submitted.'
      }
      breadcrumbs={[{ title: 'Approvals' }]}
    >
      <SectionCard
        title="Approval requests"
        headerActions={
          canCreate ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/approvals/request')}
            >
              New Request
            </Button>
          ) : null
        }
      >
        <Stack spacing={2}>
          <ApprovalStatusTabs
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            counts={statusCounts}
          />

          <ApprovalFilters typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} />

          <ApprovalTable
            approvals={filteredApprovals}
            isLoading={isLoading}
            hasFilters={hasFilters}
            canApprove={canApprove}
            canReject={canReject}
            onView={openDetails}
            onApprove={(approval) => openAction(approval, 'approve')}
            onReject={(approval) => openAction(approval, 'reject')}
          />
        </Stack>
      </SectionCard>

      <ApprovalDetailsDialog
        approvalId={selectedApprovalId}
        canApprove={canApprove}
        canReject={canReject}
        onClose={closeDetails}
        onApprove={(approval) => openAction(approval, 'approve')}
        onReject={(approval) => openAction(approval, 'reject')}
      />

      <ApprovalActionDialog
        approval={actionDialog?.approval ?? null}
        mode={actionDialog?.mode ?? 'approve'}
        isSubmitting={isActionSubmitting}
        onClose={closeAction}
        onConfirm={handleConfirmAction}
      />
    </PageContainer>
  );
}
