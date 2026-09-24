import { apiClient } from '@/lib/apiClient';
import { appConfig } from '@/config/appConfig';
import { ApiError } from '@/lib/apiError';
import { logger } from '@/lib/logger';
import { generateCustomerReportExcel } from '../utils/generateCustomerReportExcel';
import { generateUserReportExcel } from '../utils/generateUserReportExcel';
import type { ReportDefinition, ReportJob, ReportType } from '../types';

export interface DownloadedReportFile {
  blob: Blob;
  fileName: string;
}

export interface ReportsApi {
  getReports: () => Promise<ReportDefinition[]>;
  getReportJobs: () => Promise<ReportJob[]>;
  getReportJob: (id: string) => Promise<ReportJob | undefined>;
  generateReport: (reportType: ReportType) => Promise<ReportJob>;
  downloadReport: (id: string) => Promise<DownloadedReportFile>;
}

export const reportsQueryKeys = {
  all: ['reports'] as const,
  jobs: () => [...reportsQueryKeys.all, 'jobs'] as const,
  job: (id: string) => [...reportsQueryKeys.all, 'job', id] as const,
};

// ---------------------------------------------------------------------------
// Mock implementation (in-memory + simulated async job processing). Used
// while the real backend endpoints below don't exist yet — switch
// VITE_USE_MOCK_API to false once they do.
// ---------------------------------------------------------------------------

const MOCK_REPORTS: ReportDefinition[] = [
  {
    id: 'rpt_customer',
    name: 'Customer Overview',
    description: 'Customer growth, status and activity.',
    type: 'CUSTOMER',
  },
  {
    id: 'rpt_user',
    name: 'User & Access Overview',
    description: 'Users, roles and access distribution.',
    type: 'USER',
  },
];

const SIMULATED_LATENCY_MS = 300;
const PROCESSING_START_DELAY_MS = 600;
const PROCESSING_STEP_DELAY_MS = 600;
// Simulated failure rate so the FAILED status and Retry flow can be observed
// during manual testing without requiring special input. This is intentional
// mock-only randomness, not representative of real report generation.
const SIMULATED_FAILURE_RATE = 0.2;

let jobs: ReportJob[] = [];
const jobFiles = new Map<string, DownloadedReportFile>();

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function generateId(): string {
  return `job_${Math.random().toString(36).slice(2, 10)}`;
}

function updateJob(id: string, patch: Partial<ReportJob>): void {
  jobs = jobs.map((job) => (job.id === id ? { ...job, ...patch } : job));
}

async function processJob(job: ReportJob): Promise<void> {
  await delay(undefined, PROCESSING_START_DELAY_MS);
  updateJob(job.id, { status: 'PROCESSING', progress: 20 });

  await delay(undefined, PROCESSING_STEP_DELAY_MS);
  updateJob(job.id, { progress: 55 });

  await delay(undefined, PROCESSING_STEP_DELAY_MS);
  updateJob(job.id, { progress: 85 });

  try {
    const willFail = Math.random() < SIMULATED_FAILURE_RATE;
    if (willFail) {
      throw new Error('Simulated report generation failure');
    }

    let file;
    if (job.reportType === 'CUSTOMER') {
      file = await generateCustomerReportExcel();
    } else if (job.reportType === 'USER') {
      file = await generateUserReportExcel();
    } else {
      throw new Error(`Report type "${job.reportType}" is not implemented in this phase`);
    }
    jobFiles.set(job.id, file);

    updateJob(job.id, {
      status: 'COMPLETED',
      progress: 100,
      completedAt: new Date().toISOString(),
      fileName: file.fileName,
    });
  } catch (error) {
    logger.error(`[reportsApi] Report job "${job.id}" failed`, error);
    updateJob(job.id, {
      status: 'FAILED',
      errorMessage: 'Report generation failed. Please try again.',
    });
  }
}

const mockReportsApi: ReportsApi = {
  async getReports() {
    return delay(MOCK_REPORTS.map((report) => ({ ...report })));
  },

  async getReportJobs() {
    return delay(jobs.map((job) => ({ ...job })));
  },

  async getReportJob(id) {
    const found = jobs.find((job) => job.id === id);
    return delay(found ? { ...found } : undefined);
  },

  async generateReport(reportType) {
    const definition = MOCK_REPORTS.find((report) => report.type === reportType);
    if (!definition) {
      throw new Error(`Unknown report type "${reportType}"`);
    }

    const job: ReportJob = {
      id: generateId(),
      reportType,
      reportName: definition.name,
      status: 'QUEUED',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    jobs = [job, ...jobs];

    void processJob(job);

    return delay({ ...job });
  },

  async downloadReport(id) {
    const job = jobs.find((candidate) => candidate.id === id);
    if (!job || job.status !== 'COMPLETED') {
      throw new Error('Report is not available for download');
    }

    const file = jobFiles.get(id);
    if (!file) {
      throw new Error('Report file was not found');
    }

    return delay(file);
  },
};

// ---------------------------------------------------------------------------
// Real implementation. Placeholder until the backend exposes these routes —
// no other code needs to change once it does; only VITE_USE_MOCK_API flips.
//
// `downloadReport` needs the raw file bytes rather than a JSON payload, so it
// intentionally bypasses the shared JSON-oriented `apiClient` and fetches the
// binary response directly using the same base URL convention.
// ---------------------------------------------------------------------------

const BASE_PATH = '/reports';

const realReportsApi: ReportsApi = {
  getReports() {
    return apiClient.get<ReportDefinition[]>(BASE_PATH);
  },

  // Not part of the documented future contract (GET/POST /api/reports,
  // GET /api/reports/:id, GET /api/reports/:id/download) but a natural,
  // consistent extension needed to power the Report History list.
  getReportJobs() {
    return apiClient.get<ReportJob[]>(`${BASE_PATH}/jobs`);
  },

  getReportJob(id) {
    return apiClient.get<ReportJob>(`${BASE_PATH}/${id}`);
  },

  generateReport(reportType) {
    return apiClient.post<ReportJob>(BASE_PATH, { reportType });
  },

  async downloadReport(id) {
    const response = await fetch(`${appConfig.api.baseUrl}${BASE_PATH}/${id}/download`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new ApiError('Failed to download report', { status: response.status });
    }

    const disposition = response.headers.get('content-disposition') ?? '';
    const fileNameMatch = /filename="?([^"]+)"?/i.exec(disposition);
    const fileName = fileNameMatch?.[1] ?? `report-${id}.xlsx`;

    return { blob: await response.blob(), fileName };
  },
};

export const reportsApi: ReportsApi = appConfig.features.useMockReportsApi
  ? mockReportsApi
  : realReportsApi;
