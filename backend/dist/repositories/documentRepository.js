"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.findAll = findAll;
exports.findById = findById;
exports.findStoragePath = findStoragePath;
exports.create = create;
exports.remove = remove;
const pool_1 = require("../db/pool");
function generateId() {
    return `doc_${Math.random().toString(36).slice(2, 10)}`;
}
function toDocument(row) {
    return {
        id: row.id,
        originalName: row.original_name,
        storedName: row.stored_name,
        mimeType: row.mime_type,
        fileSize: Number(row.file_size),
        uploadedBy: row.uploaded_by_name,
        createdAt: row.created_at.toISOString(),
        updatedAt: row.updated_at.toISOString(),
    };
}
const SELECT_COLUMNS = `
  d.id, d.original_name, d.stored_name, d.mime_type, d.file_size,
  (u.first_name || ' ' || u.last_name) AS uploaded_by_name,
  d.created_at, d.updated_at
`;
async function findAll() {
    const { rows } = await pool_1.pool.query(`SELECT ${SELECT_COLUMNS} FROM documents d
     JOIN users u ON u.id = d.uploaded_by_id
     ORDER BY d.created_at DESC`);
    return rows.map(toDocument);
}
async function findById(id) {
    const { rows } = await pool_1.pool.query(`SELECT ${SELECT_COLUMNS} FROM documents d
     JOIN users u ON u.id = d.uploaded_by_id
     WHERE d.id = $1`, [id]);
    return rows[0] ? toDocument(rows[0]) : undefined;
}
async function findStoragePath(id) {
    const { rows } = await pool_1.pool.query('SELECT storage_path FROM documents WHERE id = $1', [id]);
    return rows[0]?.storage_path ?? undefined;
}
async function create(input) {
    await pool_1.pool.query(`INSERT INTO documents (id, original_name, stored_name, mime_type, file_size, storage_path, uploaded_by_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
        input.id,
        input.originalName,
        input.storedName,
        input.mimeType,
        input.fileSize,
        input.storagePath,
        input.uploadedById,
    ]);
    const created = await findById(input.id);
    return created;
}
async function remove(id) {
    const { rowCount } = await pool_1.pool.query('DELETE FROM documents WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
}
//# sourceMappingURL=documentRepository.js.map