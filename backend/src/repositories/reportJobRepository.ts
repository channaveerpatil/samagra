import type { ReportJob, ReportType } from '../models/Report';
import { pool } from '../db/pool';

function generateId(): string {
  return `job_${Math.random().toString(36).slice(2, 10)}`;
}

interface ReportJobRow {
  id: string;
  report_type: ReportType;
  report_name: string;
  status: ReportJob['status'];
  progress: number | null;
  file_name: string | null;
  file_path: string | null;
  error_message: string | null;
  created_at: Date;
  completed_at: Date | null;
}

function toReportJob(row: ReportJobRow): ReportJob {
  return {
    id: row.id,
    reportType: row.report_type,
    reportName: row.report_name,
    status: row.status,
    progress: row.progress ?? undefined,
    fileName: row.file_name ?? undefined,
    errorMessage: row.error_message ?? undefined,
    createdAt: row.created_at.toISOString(),
    completedAt: row.completed_at ? row.completed_at.toISOString() : undefined,
  };
}

const SELECT_COLUMNS =
  'id, report_type, report_name, status, progress, file_name, file_path, error_message, created_at, completed_at';

export async function findAll(): Promise<ReportJob[]> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM report_jobs ORDER BY created_at DESC`,
  );
  return rows.map(toReportJob);
}

export async function findById(id: string): Promise<ReportJob | undefined> {
  const { rows } = await pool.query(`SELECT ${SELECT_COLUMNS} FROM report_jobs WHERE id = $1`, [
    id,
  ]);
  return rows[0] ? toReportJob(rows[0]) : undefined;
}

export async function findFilePath(id: string): Promise<string | undefined> {
  const { rows } = await pool.query('SELECT file_path FROM report_jobs WHERE id = $1', [id]);
  return rows[0]?.file_path ?? undefined;
}

export async function create(reportType: ReportType, reportName: string, requestedById: string): Promise<ReportJob> {
  const id = generateId();
  await pool.query(
    `INSERT INTO report_jobs (id, report_type, report_name, status, progress, requested_by_id)
     VALUES ($1, $2, $3, 'QUEUED', 0, $4)`,
    [id, reportType, reportName, requestedById],
  );
  const created = await findById(id);
  return created!;
}

export async function markProcessing(id: string, progress: number): Promise<void> {
  await pool.query(`UPDATE report_jobs SET status = 'PROCESSING', progress = $2 WHERE id = $1`, [
    id,
    progress,
  ]);
}

export async function markCompleted(
  id: string,
  fileName: string,
  filePath: string,
): Promise<ReportJob> {
  await pool.query(
    `UPDATE report_jobs SET status = 'COMPLETED', progress = 100, file_name = $2, file_path = $3, completed_at = now()
     WHERE id = $1`,
    [id, fileName, filePath],
  );
  const updated = await findById(id);
  return updated!;
}

export async function markFailed(id: string, errorMessage: string): Promise<ReportJob> {
  await pool.query(
    `UPDATE report_jobs SET status = 'FAILED', error_message = $2 WHERE id = $1`,
    [id, errorMessage],
  );
  const updated = await findById(id);
  return updated!;
}
