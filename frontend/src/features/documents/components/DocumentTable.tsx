import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import type { DocumentFile } from '../types';
import DocumentEmptyState from './DocumentEmptyState';
import { formatFileSize } from '../utils/formatFileSize';

export interface DocumentTableProps {
  documents: DocumentFile[];
  isLoading: boolean;
  hasSearchTerm: boolean;
  onUpload: () => void;
  onDownload: (document: DocumentFile) => void;
  onDelete: (document: DocumentFile) => void;
  isDownloadingId?: string;
  isDeletingId?: string;
}

const COLUMNS = ['Name', 'Type', 'Size', 'Uploaded By', 'Uploaded Date', 'Actions'];
const SKELETON_ROW_COUNT = 5;

function extensionOf(fileName: string): string {
  const index = fileName.lastIndexOf('.');
  return index === -1 ? '' : fileName.slice(index + 1).toUpperCase();
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function DocumentTableSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
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

export default function DocumentTable({
  documents,
  isLoading,
  hasSearchTerm,
  onUpload,
  onDownload,
  onDelete,
  isDownloadingId,
  isDeletingId,
}: DocumentTableProps) {
  const showEmptyState = !isLoading && documents.length === 0;

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
          {isLoading ? <DocumentTableSkeleton /> : null}
          {!isLoading &&
            documents.map((document) => (
              <TableRow key={document.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {document.originalName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={extensionOf(document.originalName)} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                <TableCell>{document.uploadedBy}</TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                    <Tooltip title="Download">
                      <span>
                        <IconButton
                          size="small"
                          aria-label={`Download ${document.originalName}`}
                          onClick={() => onDownload(document)}
                          disabled={isDownloadingId === document.id}
                        >
                          <FileDownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={`Delete ${document.originalName}`}
                          onClick={() => onDelete(document)}
                          disabled={isDeletingId === document.id}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {showEmptyState ? (
        <DocumentEmptyState hasSearchTerm={hasSearchTerm} onUpload={onUpload} />
      ) : null}
    </TableContainer>
  );
}
