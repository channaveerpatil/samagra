import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

export interface FileDropzoneProps {
  accept?: string;
  disabled?: boolean;
  helperText?: string;
  onFileSelected: (file: File) => void;
}

export default function FileDropzone({
  accept,
  disabled,
  helperText,
  onFileSelected,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleBrowseClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);
    event.target.value = '';
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
      sx={{
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        borderRadius: 2,
        bgcolor: isDragActive ? 'action.hover' : 'transparent',
        p: 4,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
      }}
    >
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <CloudUploadOutlinedIcon color="action" fontSize="large" />
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Drag and drop a file here, or click to browse
        </Typography>
        {helperText ? (
          <Typography variant="caption" color="text.secondary">
            {helperText}
          </Typography>
        ) : null}
        <Button
          variant="outlined"
          size="small"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            handleBrowseClick();
          }}
        >
          Choose file
        </Button>
      </Stack>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        disabled={disabled}
        onChange={handleInputChange}
      />
    </Box>
  );
}
