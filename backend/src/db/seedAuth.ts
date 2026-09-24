import { pool } from './pool';
import { hashPassword } from '../utils/password';
import { logger } from '../utils/logger';

const DEMO_PASSWORD = 'Password123!';

async function run(): Promise<void> {
  const { rows } = await pool.query<{ id: string; email: string }>(
    'SELECT id, email FROM users WHERE password_hash IS NULL',
  );

  for (const row of rows) {
    const hash = await hashPassword(DEMO_PASSWORD);
    await pool.query('UPDATE users SET password_hash = $2 WHERE id = $1', [row.id, hash]);
    logger.info(`Seeded password for ${row.email}`);
  }

  if (rows.length > 0) {
    logger.info(`Demo password for all seeded users: ${DEMO_PASSWORD}`);
  } else {
    logger.info('No users needed a seeded password.');
  }

  await pool.end();
}

run().catch((err) => {
  logger.error('Password seeding failed', err);
  process.exitCode = 1;
});
