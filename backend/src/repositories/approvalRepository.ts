import type { ApprovalRequest, ApprovalRequestInput, ApprovalStatus } from '../models/Approval';
import { APPROVAL_REVIEWER_GROUP } from '../models/Approval';
import { pool } from '../db/pool';

function generateId(): string {
  return `apr_${Math.random().toString(36).slice(2, 10)}`;
}

interface ApprovalRow {
  id: string;
  title: string;
  description: string;
  type: ApprovalRequest['type'];
  requested_by_id: string;
  requester_first_name: string;
  requester_last_name: string;
  amount: string | null;
  status: ApprovalStatus;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
}

const SELECT_QUERY = `
  SELECT
    ar.id, ar.title, ar.description, ar.type, ar.requested_by_id,
    u.first_name AS requester_first_name, u.last_name AS requester_last_name,
    ar.amount, ar.status, ar.comment, ar.created_at, ar.updated_at
  FROM approval_requests ar
  JOIN users u ON u.id = ar.requested_by_id
`;

function toApprovalRequest(row: ApprovalRow): ApprovalRequest {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    requestedBy: {
      id: row.requested_by_id,
      name: `${row.requester_first_name} ${row.requester_last_name}`.trim(),
    },
    approver: APPROVAL_REVIEWER_GROUP,
    amount: row.amount === null ? undefined : Number(row.amount),
    status: row.status,
    comment: row.comment ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function findAll(): Promise<ApprovalRequest[]> {
  const { rows } = await pool.query(`${SELECT_QUERY} ORDER BY ar.created_at DESC`);
  return rows.map(toApprovalRequest);
}

export async function findById(id: string): Promise<ApprovalRequest | undefined> {
  const { rows } = await pool.query(`${SELECT_QUERY} WHERE ar.id = $1`, [id]);
  return rows[0] ? toApprovalRequest(rows[0]) : undefined;
}

export async function create(
  input: ApprovalRequestInput,
  requestedById: string,
): Promise<ApprovalRequest> {
  const id = generateId();
  await pool.query(
    `INSERT INTO approval_requests (id, title, description, type, requested_by_id, amount, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`,
    [id, input.title, input.description, input.type, requestedById, input.amount],
  );
  const created = await findById(id);
  return created!;
}

export async function decide(
  id: string,
  status: 'APPROVED' | 'REJECTED',
  comment: string | undefined,
): Promise<ApprovalRequest | undefined> {
  const { rowCount } = await pool.query(
    `UPDATE approval_requests SET status = $2, comment = $3, updated_at = now()
     WHERE id = $1 AND status = 'PENDING'`,
    [id, status, comment],
  );
  if (rowCount === 0) {
    return undefined;
  }
  return findById(id);
}
