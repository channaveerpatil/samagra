import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FileDropzone from '@/components/common/FileDropzone';
import useUploadDocument from '../hooks/useUploadDocument';
import { ACCEPTED_EXTENSIONS, validateDocumentFile } from '../utils/documentValidation';
import { formatFileSize } from '../utils/formatFileSize';

export interface DocumentUploadPanelProps {
  onUploaded?: () => void;
}

export default function DocumentUploadPanel({ onUploaded }: DocumentUploadPanelProps) {
  const { uploadDocument, isUploading, progress } = useUploadDocument();
  const [selectedFile, setSelectedFile] = React.useState<File | undefined>(undefined);
  const [validationError, setValidationError] = React.useState<string | undefined>(undefined);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setValidationError(validateDocumentFile(file));
  };

  const handleUpload = async () => {
    const error = validateDocumentFile(selectedFile);
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      await uploadDocument(selectedFile!);
      setSelectedFile(undefined);
      onUploaded?.();
    } catch {
      // Failure is already surfaced via the notification toast in useUploadDocument.
    }
  };

  return (
    <Stack spacing={2}>
      <FileDropzone
        accept={ACCEPTED_EXTENSIONS.join(',')}
        disabled={isUploading}
        helperText={`Supported: ${ACCEPTED_EXTENSIONS.join(', ')} (max 10 MB)`}
        onFileSelected={handleFileSelected}
      />

      {selectedFile ? (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <InsertDriveFileOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2">{selectedFile.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            ({formatFileSize(selectedFile.size)})
          </Typography>
        </Stack>
      ) : null}

      {validationError ? <Alert severity="error">{validationError}</Alert> : null}

      {isUploading ? (
        <Box>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" color="text.secondary">
            Uploading… {progress}%
          </Typography>
        </Box>
      ) : null}

      <Box>
        <Button
          variant="contained"
          disabled={!selectedFile || isUploading}
          loading={isUploading}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Box>
    </Stack>
  );
}
