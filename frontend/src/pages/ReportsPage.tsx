import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import useAuth from '@/hooks/useAuth';
import { PERMISSIONS } from '@/lib/auth/permissions';
import useReports from '@/features/reports/hooks/useReports';
import useReportJobs from '@/features/reports/hooks/useReportJobs';
import useGenerateReport from '@/features/reports/hooks/useGenerateReport';
import useDownloadReport from '@/features/reports/hooks/useDownloadReport';
import ReportDefinitionCard from '@/features/reports/components/ReportDefinitionCard';
import ReportConfigDialog from '@/features/reports/components/ReportConfigDialog';
import ReportHistoryTable from '@/features/reports/components/ReportHistoryTable';
import type { ReportDefinition, ReportJob } from '@/features/reports/types';

export default function ReportsPage() {
  const { can } = useAuth();
  const canGenerate = can(PERMISSIONS.REPORT_GENERATE);
  const canDownload = can(PERMISSIONS.REPORT_DOWNLOAD);

  const { reports } = useReports();
  const { jobs, isLoading: isLoadingJobs } = useReportJobs();
  const generateMutation = useGenerateReport();
  const downloadMutation = useDownloadReport();
  const [retryingJobId, setRetryingJobId] = React.useState<string | null>(null);
  const [configuringReport, setConfiguringReport] = React.useState<ReportDefinition | null>(null);

  const handleGenerateFirstReport = () => {
    const first = reports[0];
    if (first) {
      generateMutation.mutate(first.type);
    }
  };

  const handleGenerateFromDialog = (report: ReportDefinition) => {
    generateMutation.mutate(report.type, {
      onSuccess: () => setConfiguringReport(null),
    });
  };

  const handleDownload = (job: ReportJob) => {
    downloadMutation.mutate(job.id);
  };

  const handleRetry = (job: ReportJob) => {
    setRetryingJobId(job.id);
    generateMutation.mutate(job.reportType, {
      onSettled: () => setRetryingJobId(null),
    });
  };

  return (
    <PageContainer
      title="Reports & Insights"
      description="Turn your application data into actionable insights."
      breadcrumbs={[{ title: 'Reports' }]}
    >
      <Stack spacing={3}>
        <SectionCard
          title="Available Reports"
          description="Pick a report below to configure filters, preview matching records, and generate it."
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {reports.map((report) => (
              <ReportDefinitionCard key={report.id} report={report} onOpen={setConfiguringReport} />
            ))}
          </Box>
        </SectionCard>

        <SectionCard title="Recent Reports">
          <ReportHistoryTable
            jobs={jobs}
            isLoading={isLoadingJobs}
            canGenerate={canGenerate}
            canDownload={canDownload}
            isDownloadingJobId={
              downloadMutation.isPending ? (downloadMutation.variables ?? null) : null
            }
            isRetryingJobId={retryingJobId}
            onGenerate={handleGenerateFirstReport}
            onDownload={handleDownload}
            onRetry={handleRetry}
          />
        </SectionCard>
      </Stack>

      <ReportConfigDialog
        report={configuringReport}
        canGenerate={canGenerate}
        isGenerating={generateMutation.isPending}
        onClose={() => setConfiguringReport(null)}
        onGenerate={handleGenerateFromDialog}
      />
    </PageContainer>
  );
}
