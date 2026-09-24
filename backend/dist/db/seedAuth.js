"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("./pool");
const password_1 = require("../utils/password");
const logger_1 = require("../utils/logger");
const DEMO_PASSWORD = 'Password123!';
async function run() {
    const { rows } = await pool_1.pool.query('SELECT id, email FROM users WHERE password_hash IS NULL');
    for (const row of rows) {
        const hash = await (0, password_1.hashPassword)(DEMO_PASSWORD);
        await pool_1.pool.query('UPDATE users SET password_hash = $2 WHERE id = $1', [row.id, hash]);
        logger_1.logger.info(`Seeded password for ${row.email}`);
    }
    if (rows.length > 0) {
        logger_1.logger.info(`Demo password for all seeded users: ${DEMO_PASSWORD}`);
    }
    else {
        logger_1.logger.info('No users needed a seeded password.');
    }
    await pool_1.pool.end();
}
run().catch((err) => {
    logger_1.logger.error('Password seeding failed', err);
    process.exitCode = 1;
});
//# sourceMappingURL=seedAuth.js.map