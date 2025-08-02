// db.js
const knex = require('knex');
const knexConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'exam_system',
    charset: 'utf8mb4',
  },
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: 'knex_migrations',
  },
};

const db = knex(knexConfig);
module.exports = db;
