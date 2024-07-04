import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cityzen',
});


try {
  const client = await pool.connect();
  console.log('Connected to the database');
  return client;
} catch (err) {
  console.error('Connection error', err.stack);
  throw err;
}

export default client;
