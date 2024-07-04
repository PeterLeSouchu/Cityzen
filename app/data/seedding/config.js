import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config.js';

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'cityzen',
});

async function connectDatabase() {
  try {
    const client = await pool.connect();
    console.log('Connected to the database');
    return client;
  } catch (err) {
    console.error('Connection error', err.stack);
    throw err;
  }
}

export { connectDatabase };
export default pool;
