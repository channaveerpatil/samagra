"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
const pool_1 = require("../db/pool");
function generateId() {
    return `aud_${Math.random().toString(36).slice(2, 10)}`;
}
const SELECT_QUERY = `
  SELECT
    al.id, al.action, al.module, al.actor_id,
    u.first_name AS actor_first_name, u.last_name AS actor_last_name,
    al.target, al.description, al.previous_value, al.new_value, al.created_at
  FROM audit_logs al
  JOIN users u ON u.id = al.actor_id
`;
function toAuditLogEntry(row) {
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
async function findAll() {
    const { rows } = await pool_1.pool.query(`${SELECT_QUERY} ORDER BY al.created_at DESC`);
    return rows.map(toAuditLogEntry);
}
async function findById(id) {
    const { rows } = await pool_1.pool.query(`${SELECT_QUERY} WHERE al.id = $1`, [id]);
    return rows[0] ? toAuditLogEntry(rows[0]) : undefined;
}
async function create(input, actorId) {
    const id = generateId();
    await pool_1.pool.query(`INSERT INTO audit_logs (id, action, module, actor_id, target, description, previous_value, new_value)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
        id,
        input.action,
        input.module,
        actorId,
        input.target,
        input.description,
        input.previousValue,
        input.newValue,
    ]);
    const created = await findById(id);
    return created;
}
//# sourceMappingURL=auditLogRepository.js.map