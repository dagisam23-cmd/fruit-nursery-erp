import knex from 'knex';
import logger from '../utils/logger';

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'fruit_nursery_erp',
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10'),
  },
});

db.on('query', (query) => {
  logger.debug(`Query: ${query.sql}`);
});

db.on('query-error', (error) => {
  logger.error(`Query Error: ${error.message}`);
});

export default db;
