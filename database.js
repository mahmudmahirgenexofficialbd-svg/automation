import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Connect to a free PostgreSQL database (e.g. Supabase, Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export async function initDb() {
  try {
    // Create Posts table
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        day INTEGER NOT NULL,
        theme TEXT NOT NULL,
        caption TEXT NOT NULL,
        hashtags TEXT,
        image_prompt TEXT,
        image_path TEXT,
        status TEXT DEFAULT 'draft',
        platform TEXT,
        post_id TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        error_log TEXT
      )
    \`);

    // Create Settings/Config table
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    \`);
    console.log('Connected to PostgreSQL database and initialized tables.');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Helper methods to interact with DB
export const dbQuery = async (sql, params = []) => {
  const { rows } = await pool.query(sql, params);
  return rows;
};

// Return format similar to sqlite logic we had
export const dbRun = async (sql, params = []) => {
  // Replace ? with $1, $2, etc. for Postgres
  let pgSql = sql;
  let counter = 1;
  while(pgSql.includes('?')) {
    pgSql = pgSql.replace('?', \`$\${counter}\`);
    counter++;
  }
  
  const result = await pool.query(pgSql, params);
  return { changes: result.rowCount };
};

export default pool;
