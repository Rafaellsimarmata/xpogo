const { Pool } = require('pg');
require('dotenv').config();

let poolConfig;

if (process.env.NODE_ENV === 'production') {
  poolConfig = {
    user: process.env.SUPA_POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.AWS_POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 6543,
    database: process.env.POSTGRES_DATABASE || 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  poolConfig = {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DATABASE || 'xpogo_dev',
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
