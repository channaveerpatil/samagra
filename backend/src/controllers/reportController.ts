import type { NextFunction, Request, Response } from 'express';
import * as reportService from '../services/reportService';
import type { ReportType } from '../models/Report';
import { AppError } from '../utils/AppError';

const VALID_REPORT_TYPES: ReportType[] = ['CUSTOMER', 'USER'];

export function listReportDefinitions(_req: Request, res: Response): void {
  res.status(200).json(reportService.listReportDefinitions());
}

export async function listReportJobs(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await reportService.listReportJobs());
  } catch (err) {
    next(err);
  }
}

export async function getReportJob(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await reportService.getReportJob(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { reportType } = (req.body ?? {}) as { reportType?: ReportType };
    if (!reportType || !VALID_REPORT_TYPES.includes(reportType)) {
      throw new AppError(`"reportType" must be one of: ${VALID_REPORT_TYPES.join(', ')}`, 400);
    }
    res.status(201).json(await reportService.generateReport(reportType, req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function downloadReport(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { buffer, fileName } = await reportService.downloadReport(req.params.id, req.user!.id);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
}
