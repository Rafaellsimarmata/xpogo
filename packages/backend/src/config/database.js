const { Pool } = require('pg');
require('dotenv').config();

// Database configuration based on NODE_ENV
let poolConfig;

if (process.env.NODE_ENV === 'production') {
  // Production: Use Supabase PostgreSQL with connection pooling
  poolConfig = {
    connectionString: process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  // Development/Staging: Use local PostgreSQL with individual parameters
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
