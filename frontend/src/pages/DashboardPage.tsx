import * as React from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import GroupIcon from '@mui/icons-material/Group';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PageContainer from '@/components/layout/PageContainer';
import StatCard from '@/components/common/StatCard';
import TrendCard from '@/components/common/TrendCard';
import useAuth from '@/hooks/useAuth';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { featureFlags } from '@/config/featureFlags';
import useCustomers from '@/features/customers/hooks/useCustomers';
import useApprovals from '@/features/approvals/hooks/useApprovals';
import useReportJobs from '@/features/reports/hooks/useReportJobs';
import useUsers from '@/features/users/hooks/useUsers';
import useAuditLogs from '@/features/audit/hooks/useAuditLogs';
import { formatApprovalAmount } from '@/features/approvals/utils/formatApprovalAmount';
import {
  APPROVAL_STATUS_LABELS,
  type ApprovalRequest,
  type ApprovalStatus,
} from '@/features/approvals/types';
import { AUDIT_MODULE_LABELS, type AuditModule } from '@/features/audit/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const TREND_DAYS = 7;

function lastNDayBuckets(dates: string[], days: number): number[] {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const buckets = Array.from({ length: days }, () => 0);
  dates.forEach((iso) => {
    const dayIndex = Math.floor(
      (startOfToday.getTime() - new Date(iso).setHours(0, 0, 0, 0)) / DAY_MS,
    );
    const bucketIndex = days - 1 - dayIndex;
    if (bucketIndex >= 0 && bucketIndex < days) {
      buckets[bucketIndex] += 1;
    }
  });
  return buckets;
}

function trendDirection(data: number[]): 'up' | 'down' {
  return data[data.length - 1] >= data[0] ? 'up' : 'down';
}

function countWithinLastDays(dates: string[], days: number): number {
  const cutoff = Date.now() - days * DAY_MS;
  return dates.filter((iso) => new Date(iso).getTime() >= cutoff).length;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, can } = useAuth();
  const [statusDrawer, setStatusDrawer] = React.useState<ApprovalStatus | null>(null);

  const canViewCustomers = can(PERMISSIONS.CUSTOMER_VIEW);
  const canViewApprovals = featureFlags.approvals && can(PERMISSIONS.APPROVAL_VIEW);
  const canReviewApprovals =
    canViewApprovals && (can(PERMISSIONS.APPROVAL_APPROVE) || can(PERMISSIONS.APPROVAL_REJECT));
  const canViewReports = featureFlags.reporting && can(PERMISSIONS.REPORT_VIEW);
  const canViewTeam = can(PERMISSIONS.USER_VIEW) || can(PERMISSIONS.RBAC_MANAGE);
  const canViewAudit = featureFlags.audit && can(PERMISSIONS.AUDIT_VIEW);

  const { allCustomers } = useCustomers();
  const { approvals } = useApprovals();
  const { jobs: reportJobs } = useReportJobs();
  const { users } = useUsers();
  const { auditLogs } = useAuditLogs();

  const visibleApprovals = React.useMemo(() => {
    if (canReviewApprovals || !user) return approvals;
    return approvals.filter((approval) => approval.requestedBy.id === user.id);
  }, [approvals, canReviewApprovals, user]);

  const pendingApprovals = React.useMemo(
    () => visibleApprovals.filter((approval) => approval.status === 'PENDING'),
    [visibleApprovals],
  );
  const approvedApprovals = React.useMemo(
    () => visibleApprovals.filter((approval) => approval.status === 'APPROVED'),
    [visibleApprovals],
  );
  const rejectedApprovals = React.useMemo(
    () => visibleApprovals.filter((approval) => approval.status === 'REJECTED'),
    [visibleApprovals],
  );

  const completedReportJobs = React.useMemo(
    () => reportJobs.filter((job) => job.status === 'COMPLETED'),
    [reportJobs],
  );

  const newCustomersThisWeek = React.useMemo(
    () =>
      countWithinLastDays(
        allCustomers.map((customer) => customer.createdAt),
        7,
      ),
    [allCustomers],
  );

  const approvalsTrend = React.useMemo(
    () =>
      lastNDayBuckets(
        visibleApprovals.map((approval) => approval.createdAt),
        TREND_DAYS,
      ),
    [visibleApprovals],
  );
  const customersTrend = React.useMemo(
    () =>
      lastNDayBuckets(
        allCustomers.map((customer) => customer.createdAt),
        TREND_DAYS,
      ),
    [allCustomers],
  );
  const reportsTrend = React.useMemo(
    () =>
      lastNDayBuckets(
        completedReportJobs.map((job) => job.completedAt ?? job.createdAt),
        TREND_DAYS,
      ),
    [completedReportJobs],
  );

  const kpiStats = [
    canViewCustomers && {
      value: allCustomers.length.toLocaleString('en-IN'),
      label: 'Total Customers',
      caption: `${newCustomersThisWeek} added this week`,
      icon: <GroupIcon />,
      color: 'primary' as const,
    },
    canViewApprovals && {
      value: pendingApprovals.length.toLocaleString('en-IN'),
      label: canReviewApprovals ? 'Pending Approvals' : 'Your Pending Requests',
      caption: `${visibleApprovals.length} total requests`,
      icon: <PendingActionsOutlinedIcon />,
      color: 'warning' as const,
    },
    canViewReports && {
      value: completedReportJobs.length.toLocaleString('en-IN'),
      label: 'Reports Generated',
      caption: `${reportJobs.length} jobs run to date`,
      icon: <AssessmentOutlinedIcon />,
      color: 'info' as const,
    },
    canViewTeam && {
      value: users.length.toLocaleString('en-IN'),
      label: 'Team Members',
      caption: 'Across all roles',
      icon: <AdminPanelSettingsOutlinedIcon />,
      color: 'success' as const,
    },
  ].filter(Boolean) as {
    value: string;
    label: string;
    caption: string;
    icon: React.ReactElement;
    color: 'primary' | 'warning' | 'info' | 'success';
  }[];

  const trendCards = [
    canViewApprovals && {
      value: pendingApprovals.length.toLocaleString('en-IN'),
      label: 'Approval Requests (7d)',
      trend: trendDirection(approvalsTrend),
      color: 'warning' as const,
      data: approvalsTrend,
    },
    canViewCustomers && {
      value: newCustomersThisWeek.toLocaleString('en-IN'),
      label: 'New Customers (7d)',
      trend: trendDirection(customersTrend),
      color: 'primary' as const,
      data: customersTrend,
    },
    canViewReports && {
      value: completedReportJobs.length.toLocaleString('en-IN'),
      label: 'Reports Completed (7d)',
      trend: trendDirection(reportsTrend),
      color: 'info' as const,
      data: reportsTrend,
    },
  ].filter(Boolean) as {
    value: string;
    label: string;
    trend: 'up' | 'down';
    color: 'warning' | 'primary' | 'info';
    data: number[];
  }[];

  const approvalStatusBreakdown = [
    {
      status: 'PENDING' as const,
      label: 'Pending',
      count: pendingApprovals.length,
      color: 'warning' as const,
    },
    {
      status: 'APPROVED' as const,
      label: 'Approved',
      count: approvedApprovals.length,
      color: 'success' as const,
    },
    {
      status: 'REJECTED' as const,
      label: 'Rejected',
      count: rejectedApprovals.length,
      color: 'error' as const,
    },
  ];
  const approvalStatusTotal = visibleApprovals.length || 1;

  const approvalPieData = approvalStatusBreakdown
    .filter((segment) => segment.count > 0)
    .map((segment) => ({
      id: segment.status,
      label: segment.label,
      value: segment.count,
      color: theme.palette[segment.color].main,
    }));

  const drawerApprovals = React.useMemo(
    () =>
      statusDrawer ? visibleApprovals.filter((approval) => approval.status === statusDrawer) : [],
    [visibleApprovals, statusDrawer],
  );

  const openApprovalInPage = (approval: ApprovalRequest) => {
    setStatusDrawer(null);
    navigate('/approvals', { state: { statusFilter: approval.status, approvalId: approval.id } });
  };

  const viewAllInApprovals = () => {
    if (!statusDrawer) return;
    setStatusDrawer(null);
    navigate('/approvals', { state: { statusFilter: statusDrawer } });
  };

  const MODULE_COLORS: Record<AuditModule, 'info' | 'primary' | 'warning' | 'success'> = {
    USERS: 'info',
    CUSTOMERS: 'primary',
    APPROVALS: 'warning',
    REPORTS: 'success',
  };

  const activityModuleBreakdown = (Object.keys(AUDIT_MODULE_LABELS) as AuditModule[]).map(
    (module) => ({
      module,
      label: AUDIT_MODULE_LABELS[module],
      count: auditLogs.filter((entry) => entry.module === module).length,
      color: MODULE_COLORS[module],
    }),
  );
  const activityModuleTotal = auditLogs.length || 1;

  const activityPieData = activityModuleBreakdown
    .filter((segment) => segment.count > 0)
    .map((segment) => ({
      id: segment.module,
      label: segment.label,
      value: segment.count,
      color: theme.palette[segment.color].main,
    }));

  return (
    <PageContainer
      title="Dashboard"
      description={
        user
          ? `Welcome back, ${user.name.split(' ')[0]}. Here's what's happening across your workspace.`
          : "Here's what's happening across your workspace."
      }
      breadcrumbs={[{ title: 'Dashboard' }]}
    >
      {!canReviewApprovals && canViewApprovals && pendingApprovals.length > 0 ? (
        <Card
          variant="outlined"
          sx={(theme) => ({
            p: 2.5,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            borderColor: alpha(theme.palette.info.main, 0.4),
            backgroundColor: alpha(theme.palette.info.main, 0.08),
          })}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: (theme.vars ?? theme).shape.borderRadius,
                color: theme.palette.info.main,
                backgroundColor: alpha(theme.palette.info.main, 0.16),
              })}
            >
              <HourglassEmptyOutlinedIcon />
            </Box>
            <Stack spacing={0}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                You have {pendingApprovals.length} request{pendingApprovals.length === 1 ? '' : 's'}{' '}
                awaiting approval
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A Super Admin, Admin or Manager will review these shortly.
              </Typography>
            </Stack>
          </Stack>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/approvals')}
          >
            View Requests
          </Button>
        </Card>
      ) : null}

      {kpiStats.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: `repeat(${kpiStats.length}, 1fr)`,
            },
            gap: 2,
            mb: 2,
          }}
        >
          {kpiStats.map((stat) => (
            <StatCard key={stat.label} iconAlign="right" {...stat} />
          ))}
        </Box>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: canViewAudit ? '1fr 1fr' : '1fr' },
          gap: 2,
          mb: 2,
        }}
      >
        {canViewApprovals ? (
          <Card variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Approval Status Breakdown
            </Typography>
            {approvalPieData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No approval activity yet.
              </Typography>
            ) : (
              <>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1.5 }}
                >
                  Click a slice or a status below to see the list.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <PieChart
                    series={[
                      {
                        data: approvalPieData,
                        innerRadius: 45,
                        outerRadius: 90,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { additionalRadius: -8 },
                        valueFormatter: (item) =>
                          `${item.value} request${item.value === 1 ? '' : 's'}`,
                      },
                    ]}
                    height={200}
                    width={200}
                    hideLegend
                    onItemClick={(_event, _identifier, item) =>
                      setStatusDrawer(item.id as ApprovalStatus)
                    }
                    sx={{ cursor: 'pointer' }}
                    slotProps={{ tooltip: { trigger: 'item' } }}
                  />
                  <Stack spacing={1.5} sx={{ flex: 1, minWidth: 160 }}>
                    {approvalStatusBreakdown.map((segment) => (
                      <Stack
                        key={segment.label}
                        direction="row"
                        onClick={() => segment.count > 0 && setStatusDrawer(segment.status)}
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: segment.count > 0 ? 'pointer' : 'default',
                          borderRadius: 1,
                          px: 0.5,
                          '&:hover': segment.count > 0 ? { bgcolor: 'action.hover' } : undefined,
                        }}
                      >
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: `${segment.color}.main`,
                            }}
                          />
                          <Typography variant="body2">{segment.label}</Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {segment.count}{' '}
                          <Typography component="span" variant="caption" color="text.secondary">
                            ({Math.round((segment.count / approvalStatusTotal) * 100)}%)
                          </Typography>
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </>
            )}
          </Card>
        ) : null}

        {canViewAudit ? (
          <Card variant="outlined" sx={{ p: 2.5 }}>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Recent Activity
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/audit')}
              >
                View all
              </Button>
            </Stack>
            {activityPieData.length > 0 ? (
              <>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 2 }}
                >
                  <PieChart
                    series={[
                      {
                        data: activityPieData,
                        innerRadius: 45,
                        outerRadius: 90,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { additionalRadius: -8 },
                        valueFormatter: (item) =>
                          `${item.value} event${item.value === 1 ? '' : 's'}`,
                      },
                    ]}
                    height={200}
                    width={200}
                    hideLegend
                    onItemClick={() => navigate('/audit')}
                    sx={{ cursor: 'pointer' }}
                    slotProps={{ tooltip: { trigger: 'item' } }}
                  />
                  <Stack spacing={1.5} sx={{ flex: 1, minWidth: 160 }}>
                    {activityModuleBreakdown
                      .filter((segment) => segment.count > 0)
                      .map((segment) => (
                        <Stack
                          key={segment.module}
                          direction="row"
                          onClick={() => navigate('/audit')}
                          sx={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            borderRadius: 1,
                            px: 0.5,
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: `${segment.color}.main`,
                              }}
                            />
                            <Typography variant="body2">{segment.label}</Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {segment.count}{' '}
                            <Typography component="span" variant="caption" color="text.secondary">
                              ({Math.round((segment.count / activityModuleTotal) * 100)}%)
                            </Typography>
                          </Typography>
                        </Stack>
                      ))}
                  </Stack>
                </Stack>
              </>
            ) : null}
          </Card>
        ) : null}
      </Box>

      {trendCards.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: `repeat(${trendCards.length}, 1fr)` },
            gap: 2,
          }}
        >
          {trendCards.map((stat) => (
            <TrendCard key={stat.label} {...stat} />
          ))}
        </Box>
      ) : null}

      <Drawer
        anchor="right"
        open={!!statusDrawer}
        onClose={() => setStatusDrawer(null)}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Box sx={{ width: 360, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {statusDrawer ? APPROVAL_STATUS_LABELS[statusDrawer] : ''} Requests (
              {drawerApprovals.length})
            </Typography>
            <IconButton size="small" onClick={() => setStatusDrawer(null)}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {drawerApprovals.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                Nothing here.
              </Typography>
            ) : (
              <List disablePadding>
                {drawerApprovals.map((approval) => (
                  <ListItemButton
                    key={approval.id}
                    onClick={() => openApprovalInPage(approval)}
                    divider
                    sx={{ py: 1.5, alignItems: 'flex-start' }}
                  >
                    <ListItemText
                      primary={approval.title}
                      secondary={
                        <>
                          {approval.requestedBy.name} &middot;{' '}
                          {formatApprovalAmount(approval.amount)}
                        </>
                      }
                      slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={viewAllInApprovals}
            >
              View all in Approvals
            </Button>
          </Box>
        </Box>
      </Drawer>
    </PageContainer>
  );
}
