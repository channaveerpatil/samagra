import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AppDialogFooter from '@/components/common/AppDialogFooter';
import { APPROVAL_TYPE_LABELS, type ApprovalRequest } from '../types';
import { formatApprovalAmount } from '../utils/formatApprovalAmount';
import useApproval from '../hooks/useApproval';
import ApprovalStatusChip from './ApprovalStatusChip';

export interface ApprovalDetailsDialogProps {
  approvalId: string | null;
  canApprove: boolean;
  canReject: boolean;
  onClose: () => void;
  onApprove: (approval: ApprovalRequest) => void;
  onReject: (approval: ApprovalRequest) => void;
}

function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ApprovalDetailsDialog({
  approvalId,
  canApprove,
  canReject,
  onClose,
  onApprove,
  onReject,
}: ApprovalDetailsDialogProps) {
  const { data: approval, isLoading } = useApproval(approvalId ?? undefined);

  return (
    <Dialog open={!!approvalId} onClose={onClose} maxWidth="xs" fullWidth>
      <AppDialogHeader
        icon={<FactCheckOutlinedIcon />}
        title="Approval details"
        subtitle={approval?.title}
        onClose={onClose}
      />
      <DialogContent>
        {isLoading || !approval ? (
          <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
            Loading approval…
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ pt: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {approval.description}
              </Typography>
            </Box>
            <ApprovalStatusChip status={approval.status} />
            <Divider />
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body2">{APPROVAL_TYPE_LABELS[approval.type]}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Requested by
                </Typography>
                <Typography variant="body2">{approval.requestedBy.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Approver
                </Typography>
                <Typography variant="body2">{approval.approver.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body2">{formatApprovalAmount(approval.amount)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">{formatDateTime(approval.createdAt)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Updated
                </Typography>
                <Typography variant="body2">{formatDateTime(approval.updatedAt)}</Typography>
              </Box>
              {approval.comment ? (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Comment
                  </Typography>
                  <Typography variant="body2">{approval.comment}</Typography>
                </Box>
              ) : null}
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <AppDialogFooter>
        <Button onClick={onClose}>Close</Button>
        {approval && approval.status === 'PENDING' ? (
          <>
            {canReject ? (
              <Button
                variant="outlined"
                color="inherit"
                sx={{ color: 'text.secondary', borderColor: 'divider' }}
                startIcon={<HighlightOffIcon fontSize="small" />}
                onClick={() => onReject(approval)}
              >
                Reject
              </Button>
            ) : null}
            {canApprove ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                onClick={() => onApprove(approval)}
              >
                Approve
              </Button>
            ) : null}
          </>
        ) : null}
      </AppDialogFooter>
    </Dialog>
  );
}
