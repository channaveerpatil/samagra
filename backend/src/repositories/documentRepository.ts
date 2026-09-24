import type { DocumentFile } from '../models/Document';
import { pool } from '../db/pool';

export function generateId(): string {
  return `doc_${Math.random().toString(36).slice(2, 10)}`;
}

interface DocumentRow {
  id: string;
  original_name: string;
  stored_name: string;
  mime_type: string;
  file_size: string;
  uploaded_by_name: string;
  created_at: Date;
  updated_at: Date;
}

function toDocument(row: DocumentRow): DocumentFile {
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

export async function findAll(): Promise<DocumentFile[]> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM documents d
     JOIN users u ON u.id = d.uploaded_by_id
     ORDER BY d.created_at DESC`,
  );
  return rows.map(toDocument);
}

export async function findById(id: string): Promise<DocumentFile | undefined> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM documents d
     JOIN users u ON u.id = d.uploaded_by_id
     WHERE d.id = $1`,
    [id],
  );
  return rows[0] ? toDocument(rows[0]) : undefined;
}

export async function findStoragePath(id: string): Promise<string | undefined> {
  const { rows } = await pool.query('SELECT storage_path FROM documents WHERE id = $1', [id]);
  return rows[0]?.storage_path ?? undefined;
}

export interface CreateDocumentInput {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  uploadedById: string;
}

export async function create(input: CreateDocumentInput): Promise<DocumentFile> {
  await pool.query(
    `INSERT INTO documents (id, original_name, stored_name, mime_type, file_size, storage_path, uploaded_by_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.id,
      input.originalName,
      input.storedName,
      input.mimeType,
      input.fileSize,
      input.storagePath,
      input.uploadedById,
    ],
  );
  const created = await findById(input.id);
  return created!;
}

export async function remove(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM documents WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
