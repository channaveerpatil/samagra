import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { APPROVAL_TYPE_LABELS, type ApprovalRequest } from '../types';
import { formatApprovalAmount } from '../utils/formatApprovalAmount';
import ApprovalStatusChip from './ApprovalStatusChip';
import ApprovalEmptyState from './ApprovalEmptyState';

export interface ApprovalTableProps {
  approvals: ApprovalRequest[];
  isLoading: boolean;
  hasFilters: boolean;
  canApprove: boolean;
  canReject: boolean;
  onView: (approval: ApprovalRequest) => void;
  onApprove: (approval: ApprovalRequest) => void;
  onReject: (approval: ApprovalRequest) => void;
}

const COLUMNS = ['Request', 'Type', 'Requested By', 'Approver', 'Amount', 'Status', 'Created', ''];

function formatCreatedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ApprovalTableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {COLUMNS.map((column) => (
            <TableCell key={column}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default function ApprovalTable({
  approvals,
  isLoading,
  hasFilters,
  canApprove,
  canReject,
  onView,
  onApprove,
  onReject,
}: ApprovalTableProps) {
  const showEmptyState = !isLoading && approvals.length === 0;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table
        sx={{
          '& .MuiTableCell-root': {
            borderColor: 'divider',
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            {COLUMNS.map((column) => (
              <TableCell key={column} sx={{ fontWeight: 700, color: 'text.primary' }}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? <ApprovalTableSkeleton /> : null}
          {!isLoading &&
            approvals.map((approval) => {
              const isPending = approval.status === 'PENDING';
              return (
                <TableRow key={approval.id} hover sx={{ cursor: 'pointer' }}>
                  <TableCell onClick={() => onView(approval)}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {approval.title}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => onView(approval)}>
                    {APPROVAL_TYPE_LABELS[approval.type]}
                  </TableCell>
                  <TableCell onClick={() => onView(approval)}>
                    {approval.requestedBy.name}
                  </TableCell>
                  <TableCell onClick={() => onView(approval)}>{approval.approver.name}</TableCell>
                  <TableCell onClick={() => onView(approval)}>
                    {formatApprovalAmount(approval.amount)}
                  </TableCell>
                  <TableCell onClick={() => onView(approval)}>
                    <ApprovalStatusChip status={approval.status} />
                  </TableCell>
                  <TableCell onClick={() => onView(approval)}>
                    {formatCreatedDate(approval.createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    {isPending ? (
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        {canApprove ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                            aria-label={`Approve ${approval.title}`}
                            onClick={() => onApprove(approval)}
                          >
                            Approve
                          </Button>
                        ) : null}
                        {canReject ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            sx={{ color: 'text.secondary', borderColor: 'divider' }}
                            startIcon={<HighlightOffIcon fontSize="small" />}
                            aria-label={`Reject ${approval.title}`}
                            onClick={() => onReject(approval)}
                          >
                            Reject
                          </Button>
                        ) : null}
                      </Stack>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {showEmptyState ? <ApprovalEmptyState hasFilters={hasFilters} /> : null}
    </TableContainer>
  );
}
