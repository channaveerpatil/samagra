import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import DocumentUploadPanel from './DocumentUploadPanel';

export interface DocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DocumentUploadDialog({ open, onClose }: DocumentUploadDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <AppDialogHeader
        icon={<UploadFileOutlinedIcon />}
        title="Upload document"
        subtitle="Select or drag a file to add it to your documents."
        onClose={onClose}
      />
      <DialogContent sx={{ pt: 3 }}>
        <DocumentUploadPanel onUploaded={onClose} />
      </DialogContent>
    </Dialog>
  );
}
