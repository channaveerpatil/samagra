import type { Customer, CustomerInput } from '../models/Customer';
import { pool } from '../db/pool';

function generateId(): string {
  return `cus_${Math.random().toString(36).slice(2, 10)}`;
}

function toCustomer(row: {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: Customer['status'];
  created_at: Date;
}): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    status: row.status,
    createdAt: row.created_at.toISOString(),
  };
}

export async function findAll(): Promise<Customer[]> {
  const { rows } = await pool.query(
    'SELECT id, name, email, phone, company, status, created_at FROM customers ORDER BY created_at DESC',
  );
  return rows.map(toCustomer);
}

export async function findById(id: string): Promise<Customer | undefined> {
  const { rows } = await pool.query(
    'SELECT id, name, email, phone, company, status, created_at FROM customers WHERE id = $1',
    [id],
  );
  return rows[0] ? toCustomer(rows[0]) : undefined;
}

export async function create(input: CustomerInput): Promise<Customer> {
  const id = generateId();
  const { rows } = await pool.query(
    `INSERT INTO customers (id, name, email, phone, company, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, phone, company, status, created_at`,
    [id, input.name, input.email, input.phone, input.company, input.status],
  );
  return toCustomer(rows[0]);
}

export async function update(id: string, input: CustomerInput): Promise<Customer | undefined> {
  const { rows } = await pool.query(
    `UPDATE customers SET name = $2, email = $3, phone = $4, company = $5, status = $6
     WHERE id = $1
     RETURNING id, name, email, phone, company, status, created_at`,
    [id, input.name, input.email, input.phone, input.company, input.status],
  );
  return rows[0] ? toCustomer(rows[0]) : undefined;
}

export async function remove(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM customers WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
