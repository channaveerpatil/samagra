import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { formatRelativeTime } from '@/features/notifications/utils/formatRelativeTime';
import type { ReportJob } from '../types';
import ReportStatusChip from './ReportStatusChip';
import ReportProgress from './ReportProgress';
import ReportEmptyState from './ReportEmptyState';

export interface ReportHistoryTableProps {
  jobs: ReportJob[];
  isLoading: boolean;
  canGenerate: boolean;
  canDownload: boolean;
  isDownloadingJobId: string | null;
  isRetryingJobId: string | null;
  onGenerate: () => void;
  onDownload: (job: ReportJob) => void;
  onRetry: (job: ReportJob) => void;
}

const COLUMNS = ['Report', 'Status', 'Created', 'Action'];

export default function ReportHistoryTable({
  jobs,
  isLoading,
  canGenerate,
  canDownload,
  isDownloadingJobId,
  isRetryingJobId,
  onGenerate,
  onDownload,
  onRetry,
}: ReportHistoryTableProps) {
  const showEmptyState = !isLoading && jobs.length === 0;

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
          {!isLoading &&
            jobs.map((job) => (
              <TableRow key={job.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {job.reportName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <ReportStatusChip status={job.status} />
                    {job.status === 'PROCESSING' ? (
                      <ReportProgress progress={job.progress ?? 0} />
                    ) : null}
                    {job.status === 'FAILED' && job.errorMessage ? (
                      <Typography variant="caption" color="error.main">
                        {job.errorMessage}
                      </Typography>
                    ) : null}
                  </Stack>
                </TableCell>
                <TableCell>{formatRelativeTime(job.createdAt)}</TableCell>
                <TableCell>
                  {job.status === 'COMPLETED' && canDownload ? (
                    <Button
                      size="small"
                      variant="outlined"
                      aria-label={`Download ${job.reportName}`}
                      onClick={() => onDownload(job)}
                      loading={isDownloadingJobId === job.id}
                    >
                      Download
                    </Button>
                  ) : null}
                  {job.status === 'FAILED' && canGenerate ? (
                    <Button
                      size="small"
                      variant="outlined"
                      aria-label={`Retry ${job.reportName}`}
                      onClick={() => onRetry(job)}
                      loading={isRetryingJobId === job.id}
                    >
                      Retry
                    </Button>
                  ) : null}
                  {job.status === 'PROCESSING' || job.status === 'QUEUED' ? (
                    <Typography variant="body2" color="text.secondary">
                      {job.status === 'QUEUED' ? 'Queued' : 'Processing'}
                    </Typography>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {showEmptyState ? (
        <ReportEmptyState canGenerate={canGenerate} onGenerate={onGenerate} />
      ) : null}
    </TableContainer>
  );
}
