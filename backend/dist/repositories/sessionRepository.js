"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.findValidById = findValidById;
exports.remove = remove;
const crypto_1 = require("crypto");
const pool_1 = require("../db/pool");
function generateId() {
    return (0, crypto_1.randomBytes)(32).toString('hex');
}
function toSession(row) {
    return {
        id: row.id,
        userId: row.user_id,
        expiresAt: row.expires_at.toISOString(),
    };
}
async function create(userId, ttlMs) {
    const id = generateId();
    const expiresAt = new Date(Date.now() + ttlMs);
    const { rows } = await pool_1.pool.query(`INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at`, [id, userId, expiresAt]);
    return toSession(rows[0]);
}
async function findValidById(id) {
    const { rows } = await pool_1.pool.query('SELECT id, user_id, expires_at FROM sessions WHERE id = $1 AND expires_at > now()', [id]);
    return rows[0] ? toSession(rows[0]) : undefined;
}
async function remove(id) {
    await pool_1.pool.query('DELETE FROM sessions WHERE id = $1', [id]);
}
//# sourceMappingURL=sessionRepository.js.map