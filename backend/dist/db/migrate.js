"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const pool_1 = require("./pool");
const logger_1 = require("../utils/logger");
const MIGRATIONS_DIR = (0, path_1.join)(__dirname, '..', '..', 'db', 'migrations');
async function run() {
    await pool_1.pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);
    const files = (0, fs_1.readdirSync)(MIGRATIONS_DIR)
        .filter((file) => file.endsWith('.sql'))
        .sort();
    for (const file of files) {
        const { rows } = await pool_1.pool.query('SELECT 1 FROM schema_migrations WHERE name = $1', [file]);
        if (rows.length > 0) {
            continue;
        }
        const sql = (0, fs_1.readFileSync)((0, path_1.join)(MIGRATIONS_DIR, file), 'utf-8');
        logger_1.logger.info(`Applying migration ${file}`);
        const client = await pool_1.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
            await client.query('COMMIT');
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }
    logger_1.logger.info('Migrations up to date.');
    await pool_1.pool.end();
}
run().catch((err) => {
    logger_1.logger.error('Migration failed', err);
    process.exitCode = 1;
});
//# sourceMappingURL=migrate.js.map