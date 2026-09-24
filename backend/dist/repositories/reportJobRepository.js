"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.findFilePath = findFilePath;
exports.create = create;
exports.markProcessing = markProcessing;
exports.markCompleted = markCompleted;
exports.markFailed = markFailed;
const pool_1 = require("../db/pool");
function generateId() {
    return `job_${Math.random().toString(36).slice(2, 10)}`;
}
function toReportJob(row) {
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
const SELECT_COLUMNS = 'id, report_type, report_name, status, progress, file_name, file_path, error_message, created_at, completed_at';
async function findAll() {
    const { rows } = await pool_1.pool.query(`SELECT ${SELECT_COLUMNS} FROM report_jobs ORDER BY created_at DESC`);
    return rows.map(toReportJob);
}
async function findById(id) {
    const { rows } = await pool_1.pool.query(`SELECT ${SELECT_COLUMNS} FROM report_jobs WHERE id = $1`, [
        id,
    ]);
    return rows[0] ? toReportJob(rows[0]) : undefined;
}
async function findFilePath(id) {
    const { rows } = await pool_1.pool.query('SELECT file_path FROM report_jobs WHERE id = $1', [id]);
    return rows[0]?.file_path ?? undefined;
}
async function create(reportType, reportName, requestedById) {
    const id = generateId();
    await pool_1.pool.query(`INSERT INTO report_jobs (id, report_type, report_name, status, progress, requested_by_id)
     VALUES ($1, $2, $3, 'QUEUED', 0, $4)`, [id, reportType, reportName, requestedById]);
    const created = await findById(id);
    return created;
}
async function markProcessing(id, progress) {
    await pool_1.pool.query(`UPDATE report_jobs SET status = 'PROCESSING', progress = $2 WHERE id = $1`, [
        id,
        progress,
    ]);
}
async function markCompleted(id, fileName, filePath) {
    await pool_1.pool.query(`UPDATE report_jobs SET status = 'COMPLETED', progress = 100, file_name = $2, file_path = $3, completed_at = now()
     WHERE id = $1`, [id, fileName, filePath]);
    const updated = await findById(id);
    return updated;
}
async function markFailed(id, errorMessage) {
    await pool_1.pool.query(`UPDATE report_jobs SET status = 'FAILED', error_message = $2 WHERE id = $1`, [id, errorMessage]);
    const updated = await findById(id);
    return updated;
}
//# sourceMappingURL=reportJobRepository.js.map