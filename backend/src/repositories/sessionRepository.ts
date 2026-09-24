import { randomBytes } from 'crypto';
import type { Session } from '../models/Session';
import { pool } from '../db/pool';

function generateId(): string {
  return randomBytes(32).toString('hex');
}

function toSession(row: { id: string; user_id: string; expires_at: Date }): Session {
  return {
    id: row.id,
    userId: row.user_id,
    expiresAt: row.expires_at.toISOString(),
  };
}

export async function create(userId: string, ttlMs: number): Promise<Session> {
  const id = generateId();
  const expiresAt = new Date(Date.now() + ttlMs);
  const { rows } = await pool.query(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at`,
    [id, userId, expiresAt],
  );
  return toSession(rows[0]);
}

export async function findValidById(id: string): Promise<Session | undefined> {
  const { rows } = await pool.query(
    'SELECT id, user_id, expires_at FROM sessions WHERE id = $1 AND expires_at > now()',
    [id],
  );
  return rows[0] ? toSession(rows[0]) : undefined;
}

export async function remove(id: string): Promise<void> {
  await pool.query('DELETE FROM sessions WHERE id = $1', [id]);
}
