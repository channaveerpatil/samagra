import * as reportJobRepository from '../repositories/reportJobRepository';
import * as auditLogService from './auditLogService';
import { generateReportFile } from './reportGenerationService';
import { readReportFile, writeReportFile } from '../utils/reportFiles';
import { REPORT_DEFINITIONS } from '../models/Report';
import type { ReportDefinition, ReportJob, ReportType } from '../models/Report';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export function listReportDefinitions(): ReportDefinition[] {
  return REPORT_DEFINITIONS;
}

export async function listReportJobs(): Promise<ReportJob[]> {
  return reportJobRepository.findAll();
}

export async function getReportJob(id: string): Promise<ReportJob> {
  const job = await reportJobRepository.findById(id);
  if (!job) {
    throw new AppError(`Report job "${id}" was not found`, 404);
  }
  return job;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function completeGeneration(job: ReportJob, requestedById: string): Promise<ReportJob> {
  const { buffer, fileName } = await generateReportFile(job.reportType);
  const filePath = writeReportFile(fileName, buffer);
  const completed = await reportJobRepository.markCompleted(job.id, fileName, filePath);

  auditLogService.record(
    {
      action: 'REPORT_GENERATED',
      module: 'REPORTS',
      target: completed.reportName,
      description: `Generated the ${completed.reportName} report.`,
    },
    requestedById,
  );

  return completed;
}

// The User & Access report intentionally runs in the background with staged
// progress instead of completing inline — a deliberate UX choice (the user
// should see it "processing" for a bit) rather than a technical necessity.
// Every other report type still generates synchronously per the roadmap's
// call to avoid a real queue/worker architecture.
async function generateUserReportInBackground(
  job: ReportJob,
  requestedById: string,
): Promise<void> {
  try {
    await sleep(1200);
    await reportJobRepository.markProcessing(job.id, 30);

    await sleep(1500);
    await reportJobRepository.markProcessing(job.id, 65);

    await sleep(1500);
    await reportJobRepository.markProcessing(job.id, 90);

    await sleep(800);
    await completeGeneration(job, requestedById);
  } catch (err) {
    logger.error(`Report job "${job.id}" failed`, err);
    await reportJobRepository.markFailed(job.id, 'Report generation failed. Please try again.');
  }
}

export async function generateReport(reportType: ReportType, requestedById: string): Promise<ReportJob> {
  const definition = REPORT_DEFINITIONS.find((report) => report.type === reportType);
  if (!definition) {
    throw new AppError(`Unknown report type "${reportType}"`, 400);
  }

  const job = await reportJobRepository.create(reportType, definition.name, requestedById);

  if (reportType === 'USER') {
    void generateUserReportInBackground(job, requestedById);
    return job;
  }

  try {
    return await completeGeneration(job, requestedById);
  } catch (err) {
    logger.error(`Report job "${job.id}" failed`, err);
    return reportJobRepository.markFailed(
      job.id,
      'Report generation failed. Please try again.',
    );
  }
}

export async function downloadReport(
  id: string,
  requestedById: string,
): Promise<{ buffer: Buffer; fileName: string }> {
  const job = await reportJobRepository.findById(id);
  if (!job || job.status !== 'COMPLETED' || !job.fileName) {
    throw new AppError('Report is not available for download', 404);
  }

  const filePath = await reportJobRepository.findFilePath(id);
  if (!filePath) {
    throw new AppError('Report file was not found', 404);
  }

  const buffer = readReportFile(filePath);

  auditLogService.record(
    {
      action: 'REPORT_DOWNLOADED',
      module: 'REPORTS',
      target: job.reportName,
      description: `Downloaded the ${job.reportName} report.`,
    },
    requestedById,
  );

  return { buffer, fileName: job.fileName };
}
