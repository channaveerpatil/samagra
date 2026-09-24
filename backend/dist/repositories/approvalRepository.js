"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.decide = decide;
const Approval_1 = require("../models/Approval");
const pool_1 = require("../db/pool");
function generateId() {
    return `apr_${Math.random().toString(36).slice(2, 10)}`;
}
const SELECT_QUERY = `
  SELECT
    ar.id, ar.title, ar.description, ar.type, ar.requested_by_id,
    u.first_name AS requester_first_name, u.last_name AS requester_last_name,
    ar.amount, ar.status, ar.comment, ar.created_at, ar.updated_at
  FROM approval_requests ar
  JOIN users u ON u.id = ar.requested_by_id
`;
function toApprovalRequest(row) {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        requestedBy: {
            id: row.requested_by_id,
            name: `${row.requester_first_name} ${row.requester_last_name}`.trim(),
        },
        approver: Approval_1.APPROVAL_REVIEWER_GROUP,
        amount: row.amount === null ? undefined : Number(row.amount),
        status: row.status,
        comment: row.comment ?? undefined,
        createdAt: row.created_at.toISOString(),
        updatedAt: row.updated_at.toISOString(),
    };
}
async function findAll() {
    const { rows } = await pool_1.pool.query(`${SELECT_QUERY} ORDER BY ar.created_at DESC`);
    return rows.map(toApprovalRequest);
}
async function findById(id) {
    const { rows } = await pool_1.pool.query(`${SELECT_QUERY} WHERE ar.id = $1`, [id]);
    return rows[0] ? toApprovalRequest(rows[0]) : undefined;
}
async function create(input, requestedById) {
    const id = generateId();
    await pool_1.pool.query(`INSERT INTO approval_requests (id, title, description, type, requested_by_id, amount, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`, [id, input.title, input.description, input.type, requestedById, input.amount]);
    const created = await findById(id);
    return created;
}
async function decide(id, status, comment) {
    const { rowCount } = await pool_1.pool.query(`UPDATE approval_requests SET status = $2, comment = $3, updated_at = now()
     WHERE id = $1 AND status = 'PENDING'`, [id, status, comment]);
    if (rowCount === 0) {
        return undefined;
    }
    return findById(id);
}
//# sourceMappingURL=approvalRepository.js.map