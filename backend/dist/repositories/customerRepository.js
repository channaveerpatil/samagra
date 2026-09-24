"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const pool_1 = require("../db/pool");
function generateId() {
    return `cus_${Math.random().toString(36).slice(2, 10)}`;
}
function toCustomer(row) {
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
async function findAll() {
    const { rows } = await pool_1.pool.query('SELECT id, name, email, phone, company, status, created_at FROM customers ORDER BY created_at DESC');
    return rows.map(toCustomer);
}
async function findById(id) {
    const { rows } = await pool_1.pool.query('SELECT id, name, email, phone, company, status, created_at FROM customers WHERE id = $1', [id]);
    return rows[0] ? toCustomer(rows[0]) : undefined;
}
async function create(input) {
    const id = generateId();
    const { rows } = await pool_1.pool.query(`INSERT INTO customers (id, name, email, phone, company, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, phone, company, status, created_at`, [id, input.name, input.email, input.phone, input.company, input.status]);
    return toCustomer(rows[0]);
}
async function update(id, input) {
    const { rows } = await pool_1.pool.query(`UPDATE customers SET name = $2, email = $3, phone = $4, company = $5, status = $6
     WHERE id = $1
     RETURNING id, name, email, phone, company, status, created_at`, [id, input.name, input.email, input.phone, input.company, input.status]);
    return rows[0] ? toCustomer(rows[0]) : undefined;
}
async function remove(id) {
    const { rowCount } = await pool_1.pool.query('DELETE FROM customers WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
}
//# sourceMappingURL=customerRepository.js.map