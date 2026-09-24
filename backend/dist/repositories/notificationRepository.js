"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllForUser = findAllForUser;
exports.findByIdForUser = findByIdForUser;
exports.create = create;
exports.markAsRead = markAsRead;
exports.markAllAsRead = markAllAsRead;
const pool_1 = require("../db/pool");
function generateId() {
    return `ntf_${Math.random().toString(36).slice(2, 10)}`;
}
function toNotificationItem(row) {
    return {
        id: row.id,
        userId: row.user_id,
        type: row.type,
        title: row.title,
        message: row.message,
        actionType: row.action_type ?? undefined,
        metadata: row.metadata ?? undefined,
        isRead: row.is_read,
        createdAt: row.created_at.toISOString(),
    };
}
const SELECT_COLUMNS = 'id, user_id, type, title, message, action_type, metadata, is_read, created_at';
async function findAllForUser(userId) {
    const { rows } = await pool_1.pool.query(`SELECT ${SELECT_COLUMNS} FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
    return rows.map(toNotificationItem);
}
async function findByIdForUser(id, userId) {
    const { rows } = await pool_1.pool.query(`SELECT ${SELECT_COLUMNS} FROM notifications WHERE id = $1 AND user_id = $2`, [id, userId]);
    return rows[0] ? toNotificationItem(rows[0]) : undefined;
}
async function create(input, userId) {
    const id = generateId();
    const { rows } = await pool_1.pool.query(`INSERT INTO notifications (id, user_id, type, title, message, action_type, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${SELECT_COLUMNS}`, [
        id,
        userId,
        input.type,
        input.title,
        input.message,
        input.actionType,
        input.metadata ? JSON.stringify(input.metadata) : null,
    ]);
    return toNotificationItem(rows[0]);
}
async function markAsRead(id, userId) {
    const { rows } = await pool_1.pool.query(`UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2
     RETURNING ${SELECT_COLUMNS}`, [id, userId]);
    return rows[0] ? toNotificationItem(rows[0]) : undefined;
}
async function markAllAsRead(userId) {
    const { rows } = await pool_1.pool.query(`UPDATE notifications SET is_read = true WHERE user_id = $1
     RETURNING ${SELECT_COLUMNS}`, [userId]);
    return rows.map(toNotificationItem);
}
//# sourceMappingURL=notificationRepository.js.map