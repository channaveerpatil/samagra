import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AppDialogFooter from '@/components/common/AppDialogFooter';
import type { ApprovalRequest } from '../types';

export type ApprovalActionMode = 'approve' | 'reject';

export interface ApprovalActionDialogProps {
  approval: ApprovalRequest | null;
  mode: ApprovalActionMode;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (comment: string | undefined) => void;
}

const MODE_COPY: Record<
  ApprovalActionMode,
  {
    title: string;
    confirmLabel: string;
    confirmColor: 'success' | 'error';
    commentLabel: string;
    icon: React.ReactNode;
  }
> = {
  approve: {
    title: 'Approve request',
    confirmLabel: 'Approve',
    confirmColor: 'success',
    commentLabel: 'Approval comment (optional)',
    icon: <CheckCircleOutlineIcon />,
  },
  reject: {
    title: 'Reject request',
    confirmLabel: 'Reject',
    confirmColor: 'error',
    commentLabel: 'Reason for rejection (optional)',
    icon: <CancelOutlinedIcon />,
  },
};

interface ApprovalActionFieldsProps {
  approval: ApprovalRequest;
  mode: ApprovalActionMode;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (comment: string | undefined) => void;
}

function ApprovalActionFields({
  approval,
  mode,
  isSubmitting,
  onClose,
  onConfirm,
}: ApprovalActionFieldsProps) {
  const [comment, setComment] = React.useState('');
  const copy = MODE_COPY[mode];

  const handleConfirm = () => {
    onConfirm(comment.trim() || undefined);
  };

  return (
    <>
      <AppDialogHeader
        titleId="approval-action-dialog-title"
        icon={copy.icon}
        title={copy.title}
        subtitle={approval.title}
        color={copy.confirmColor}
        onClose={onClose}
        closeDisabled={isSubmitting}
      />
      <DialogContent>
        <DialogContentText sx={{ mb: 2, pt: 2 }}>
          Leave an optional comment before confirming.
        </DialogContentText>
        <TextField
          label={copy.commentLabel}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          multiline
          minRows={2}
          fullWidth
          autoFocus
        />
      </DialogContent>
      <AppDialogFooter>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={copy.confirmColor}
          onClick={handleConfirm}
          loading={isSubmitting}
        >
          {copy.confirmLabel}
        </Button>
      </AppDialogFooter>
    </>
  );
}

export default function ApprovalActionDialog({
  approval,
  mode,
  isSubmitting,
  onClose,
  onConfirm,
}: ApprovalActionDialogProps) {
  return (
    <Dialog
      open={!!approval}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="approval-action-dialog-title"
    >
      {approval ? (
        <ApprovalActionFields
          key={`${approval.id}-${mode}`}
          approval={approval}
          mode={mode}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      ) : null}
    </Dialog>
  );
}
