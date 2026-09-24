import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AppDialogFooter from '@/components/common/AppDialogFooter';
import { AUDIT_MODULE_LABELS } from '../types';
import useAuditLog from '../hooks/useAuditLog';
import AuditActionChip from './AuditActionChip';

export interface AuditDetailsDialogProps {
  auditLogId: string | null;
  onClose: () => void;
}

function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function AuditDetailsDialog({ auditLogId, onClose }: AuditDetailsDialogProps) {
  const { data: entry, isLoading } = useAuditLog(auditLogId ?? undefined);

  return (
    <Dialog open={!!auditLogId} onClose={onClose} maxWidth="xs" fullWidth>
      <AppDialogHeader
        icon={<HistoryOutlinedIcon />}
        title="Audit record details"
        subtitle={entry?.target}
        onClose={onClose}
      />
      <DialogContent>
        {isLoading || !entry ? (
          <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
            Loading audit record…
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ pt: 2 }}>
            {entry.description ? (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {entry.description}
                </Typography>
              </Box>
            ) : null}
            <AuditActionChip action={entry.action} />
            <Divider />
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Actor
                </Typography>
                <Typography variant="body2">{entry.actor.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Module
                </Typography>
                <Typography variant="body2">{AUDIT_MODULE_LABELS[entry.module]}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Target
                </Typography>
                <Typography variant="body2">{entry.target}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Timestamp
                </Typography>
                <Typography variant="body2">{formatDateTime(entry.createdAt)}</Typography>
              </Box>
              {entry.previousValue ? (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Previous value
                  </Typography>
                  <Typography variant="body2">{entry.previousValue}</Typography>
                </Box>
              ) : null}
              {entry.newValue ? (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    New value
                  </Typography>
                  <Typography variant="body2">{entry.newValue}</Typography>
                </Box>
              ) : null}
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <AppDialogFooter>
        <Button onClick={onClose}>Close</Button>
      </AppDialogFooter>
    </Dialog>
  );
}
