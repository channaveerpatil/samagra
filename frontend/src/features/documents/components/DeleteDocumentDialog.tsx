import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AppDialogFooter from '@/components/common/AppDialogFooter';
import type { DocumentFile } from '../types';

export interface DeleteDocumentDialogProps {
  document: DocumentFile | null;
  onClose: () => void;
  onConfirm: (document: DocumentFile) => Promise<void>;
}

export default function DeleteDocumentDialog({
  document,
  onClose,
  onConfirm,
}: DeleteDocumentDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    if (!document) return;
    setIsDeleting(true);
    try {
      await onConfirm(document);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={!!document} onClose={onClose} maxWidth="xs" fullWidth>
      <AppDialogHeader
        icon={<DeleteOutlinedIcon />}
        title="Delete document"
        color="error"
        onClose={onClose}
        closeDisabled={isDeleting}
      />
      <DialogContent>
        <DialogContentText sx={{ pt: 2 }}>
          Are you sure you want to delete <strong>{document?.originalName}</strong>? This action
          cannot be undone.
        </DialogContentText>
      </DialogContent>
      <AppDialogFooter>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={handleConfirm} loading={isDeleting}>
          Delete
        </Button>
      </AppDialogFooter>
    </Dialog>
  );
}
