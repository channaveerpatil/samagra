import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { AUDIT_MODULE_LABELS, type AuditLogEntry } from '../types';
import AuditActionChip from './AuditActionChip';
import AuditEmptyState from './AuditEmptyState';

export interface AuditTableProps {
  auditLogs: AuditLogEntry[];
  isLoading: boolean;
  hasFilters: boolean;
  onView: (entry: AuditLogEntry) => void;
}

const COLUMNS = ['Timestamp', 'Actor', 'Action', 'Module', 'Target', 'Description'];

function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function AuditTableSkeleton() {
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

export default function AuditTable({ auditLogs, isLoading, hasFilters, onView }: AuditTableProps) {
  const showEmptyState = !isLoading && auditLogs.length === 0;

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
          {isLoading ? <AuditTableSkeleton /> : null}
          {!isLoading &&
            auditLogs.map((entry) => (
              <TableRow
                key={entry.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => onView(entry)}
              >
                <TableCell>{formatDateTime(entry.createdAt)}</TableCell>
                <TableCell>{entry.actor.name}</TableCell>
                <TableCell>
                  <AuditActionChip action={entry.action} />
                </TableCell>
                <TableCell>{AUDIT_MODULE_LABELS[entry.module]}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {entry.target}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 320,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.description ?? '—'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {showEmptyState ? <AuditEmptyState hasFilters={hasFilters} /> : null}
    </TableContainer>
  );
}
