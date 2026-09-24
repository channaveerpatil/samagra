import type { User, UserInput, UserProfileUpdate } from '../models/User';
import { pool } from '../db/pool';

function generateId(): string {
  return `user_${Math.random().toString(36).slice(2, 10)}`;
}

interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: User['role'];
  phone: string | null;
  company: string | null;
  website: string | null;
  created_at: Date;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
    phone: row.phone ?? undefined,
    company: row.company ?? undefined,
    website: row.website ?? undefined,
    createdAt: row.created_at.toISOString(),
  };
}

const SELECT_COLUMNS = 'id, first_name, last_name, email, role, phone, company, website, created_at';

export async function findAll(): Promise<User[]> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM users ORDER BY created_at DESC`,
  );
  return rows.map(toUser);
}

export async function findById(id: string): Promise<User | undefined> {
  const { rows } = await pool.query(`SELECT ${SELECT_COLUMNS} FROM users WHERE id = $1`, [id]);
  return rows[0] ? toUser(rows[0]) : undefined;
}

export async function findByEmail(email: string): Promise<User | undefined> {
  const { rows } = await pool.query(`SELECT ${SELECT_COLUMNS} FROM users WHERE lower(email) = lower($1)`, [
    email,
  ]);
  return rows[0] ? toUser(rows[0]) : undefined;
}

export async function findCredentialByEmail(
  email: string,
): Promise<{ user: User; passwordHash: string | null } | undefined> {
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS}, password_hash FROM users WHERE lower(email) = lower($1)`,
    [email],
  );
  if (!rows[0]) {
    return undefined;
  }
  return { user: toUser(rows[0]), passwordHash: rows[0].password_hash };
}

export async function create(input: UserInput, passwordHash?: string): Promise<User> {
  const id = generateId();
  const { rows } = await pool.query(
    `INSERT INTO users (id, first_name, last_name, email, role, phone, company, website, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${SELECT_COLUMNS}`,
    [
      id,
      input.firstName,
      input.lastName,
      input.email,
      input.role,
      input.phone,
      input.company,
      input.website,
      passwordHash,
    ],
  );
  return toUser(rows[0]);
}

export async function update(id: string, input: UserInput): Promise<User | undefined> {
  const { rows } = await pool.query(
    `UPDATE users SET first_name = $2, last_name = $3, email = $4, role = $5, phone = $6, company = $7, website = $8, updated_at = now()
     WHERE id = $1
     RETURNING ${SELECT_COLUMNS}`,
    [
      id,
      input.firstName,
      input.lastName,
      input.email,
      input.role,
      input.phone,
      input.company,
      input.website,
    ],
  );
  return rows[0] ? toUser(rows[0]) : undefined;
}

export async function updatePasswordHash(id: string, passwordHash: string): Promise<void> {
  await pool.query('UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1', [
    id,
    passwordHash,
  ]);
}

export async function updateProfile(
  id: string,
  updates: UserProfileUpdate,
): Promise<User | undefined> {
  const current = await findById(id);
  if (!current) {
    return undefined;
  }
  const merged: UserInput = {
    firstName: updates.firstName ?? current.firstName,
    lastName: updates.lastName ?? current.lastName,
    email: current.email,
    role: current.role,
    phone: updates.phone ?? current.phone,
    company: updates.company ?? current.company,
    website: updates.website ?? current.website,
  };
  return update(id, merged);
}
