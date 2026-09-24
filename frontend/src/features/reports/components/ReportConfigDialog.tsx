import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AppDialogFooter from '@/components/common/AppDialogFooter';
import useCustomers from '@/features/customers/hooks/useCustomers';
import {
  getDefaultFilterValues,
  getReportUIConfig,
  type ReportFilterValues,
} from '../reportRegistry';
import type { ReportDefinition } from '../types';

export interface ReportConfigDialogProps {
  report: ReportDefinition | null;
  canGenerate: boolean;
  isGenerating: boolean;
  onClose: () => void;
  onGenerate: (report: ReportDefinition) => void;
}

interface ReportConfigFieldsProps {
  report: ReportDefinition;
  canGenerate: boolean;
  isGenerating: boolean;
  onClose: () => void;
  onGenerate: (report: ReportDefinition) => void;
}

function ReportPreview({
  stats,
}: {
  stats: { key: string; label: string; value: number; emphasis?: boolean }[];
}) {
  if (stats.length === 0) return null;

  const [primary, ...rest] = stats;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'action.hover' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
        <InsightsOutlinedIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Report Preview
        </Typography>
      </Stack>
      <Stack spacing={1.5}>
        <Stack>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {primary.value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {primary.label}
          </Typography>
        </Stack>
        {rest.length > 0 ? (
          <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
            {rest.map((stat) => (
              <Stack key={stat.key}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {stat.value.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}

function ReportConfigFields({
  report,
  canGenerate,
  isGenerating,
  onClose,
  onGenerate,
}: ReportConfigFieldsProps) {
  const config = getReportUIConfig(report.type);
  const { allCustomers } = useCustomers();
  const [filters, setFilters] = React.useState<ReportFilterValues>(getDefaultFilterValues);

  const updateFilter = <K extends keyof ReportFilterValues>(
    key: K,
    value: ReportFilterValues[K],
  ) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const previewStats = React.useMemo(
    () => config.computePreview(filters, { customers: allCustomers }),
    [config, filters, allCustomers],
  );

  return (
    <>
      <AppDialogHeader
        titleId="report-config-dialog-title"
        icon={config.icon}
        title={report.name}
        subtitle={report.description}
        color={config.color}
        onClose={onClose}
        closeDisabled={isGenerating}
      />
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              label="From date"
              type="date"
              value={filters.dateFrom}
              onChange={(event) => updateFilter('dateFrom', event.target.value)}
              disabled={!config.dateRange.enabled}
              helperText={config.dateRange.enabled ? undefined : config.dateRange.helperText}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="To date"
              type="date"
              value={filters.dateTo}
              onChange={(event) => updateFilter('dateTo', event.target.value)}
              disabled={!config.dateRange.enabled}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />

            {config.status ? (
              <TextField
                select
                label="Status"
                value={filters.status}
                onChange={(event) => updateFilter('status', event.target.value)}
                disabled={!config.status.enabled}
                helperText={config.status.enabled ? undefined : config.status.helperText}
                fullWidth
              >
                {config.status.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}

            {config.role ? (
              <TextField
                select
                label="Role"
                value={filters.role}
                onChange={(event) => updateFilter('role', event.target.value)}
                fullWidth
              >
                {config.role.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
          </Box>

          {config.dataOptions.length > 0 ? (
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Report data options
              </Typography>
              {config.dataOptions.map((option) => (
                <FormControlLabel
                  key={option.key}
                  control={
                    <Checkbox
                      checked={filters[option.key]}
                      onChange={(event) => updateFilter(option.key, event.target.checked)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </Stack>
          ) : null}

          <Divider />

          <ReportPreview stats={previewStats} />
        </Stack>
      </DialogContent>
      <AppDialogFooter
        icon={<DescriptionOutlinedIcon fontSize="small" />}
        note="Excel (.xlsx) will be generated on completion"
      >
        <Button onClick={onClose} disabled={isGenerating}>
          Cancel
        </Button>
        {canGenerate ? (
          <Button variant="contained" onClick={() => onGenerate(report)} loading={isGenerating}>
            Generate Report
          </Button>
        ) : null}
      </AppDialogFooter>
    </>
  );
}

export default function ReportConfigDialog({
  report,
  canGenerate,
  isGenerating,
  onClose,
  onGenerate,
}: ReportConfigDialogProps) {
  return (
    <Dialog
      open={!!report}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="report-config-dialog-title"
    >
      {report ? (
        <ReportConfigFields
          key={report.id}
          report={report}
          canGenerate={canGenerate}
          isGenerating={isGenerating}
          onClose={onClose}
          onGenerate={onGenerate}
        />
      ) : null}
    </Dialog>
  );
}
