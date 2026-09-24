import type { AuditLogEntry, AuditLogInput } from '../models/AuditLog';
import { pool } from '../db/pool';

function generateId(): string {
  return `aud_${Math.random().toString(36).slice(2, 10)}`;
}

interface AuditLogRow {
  id: string;
  action: AuditLogEntry['action'];
  module: AuditLogEntry['module'];
  actor_id: string;
  actor_first_name: string;
  actor_last_name: string;
  target: string;
  description: string | null;
  previous_value: string | null;
  new_value: string | null;
  created_at: Date;
}

const SELECT_QUERY = `
  SELECT
    al.id, al.action, al.module, al.actor_id,
    u.first_name AS actor_first_name, u.last_name AS actor_last_name,
    al.target, al.description, al.previous_value, al.new_value, al.created_at
  FROM audit_logs al
  JOIN users u ON u.id = al.actor_id
`;

function toAuditLogEntry(row: AuditLogRow): AuditLogEntry {
  return {
    id: row.id,
    action: row.action,
    module: row.module,
    actor: {
      id: row.actor_id,
      name: `${row.actor_first_name} ${row.actor_last_name}`.trim(),
    },
    target: row.target,
    description: row.description ?? undefined,
    previousValue: row.previous_value ?? undefined,
    newValue: row.new_value ?? undefined,
    createdAt: row.created_at.toISOString(),
  };
}

export async function findAll(): Promise<AuditLogEntry[]> {
  const { rows } = await pool.query(`${SELECT_QUERY} ORDER BY al.created_at DESC`);
  return rows.map(toAuditLogEntry);
}

export async function findById(id: string): Promise<AuditLogEntry | undefined> {
  const { rows } = await pool.query(`${SELECT_QUERY} WHERE al.id = $1`, [id]);
  return rows[0] ? toAuditLogEntry(rows[0]) : undefined;
}

export async function create(input: AuditLogInput, actorId: string): Promise<AuditLogEntry> {
  const id = generateId();
  await pool.query(
    `INSERT INTO audit_logs (id, action, module, actor_id, target, description, previous_value, new_value)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      input.action,
      input.module,
      actorId,
      input.target,
      input.description,
      input.previousValue,
      input.newValue,
    ],
  );
  const created = await findById(id);
  return created!;
}
