import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

export interface DocumentEmptyStateProps {
  hasSearchTerm: boolean;
  onUpload: () => void;
}

export default function DocumentEmptyState({ hasSearchTerm, onUpload }: DocumentEmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, px: 3 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', maxWidth: 360 }}>
        <UploadFileOutlinedIcon color="disabled" sx={{ fontSize: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {hasSearchTerm ? 'No documents match your search' : 'No documents yet'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hasSearchTerm
            ? 'Try a different file name.'
            : 'Upload your first document to get started.'}
        </Typography>
        {!hasSearchTerm ? (
          <Button variant="contained" onClick={onUpload} sx={{ mt: 1 }}>
            Upload Documents
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
