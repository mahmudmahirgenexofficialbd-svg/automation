import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Using a file-based SQLite database
const dbPath = path.resolve(__dirname, 'social_automation.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Create Posts table
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day INTEGER NOT NULL,
        theme TEXT NOT NULL,
        caption TEXT NOT NULL,
        hashtags TEXT,
        image_prompt TEXT,
        image_path TEXT,
        status TEXT DEFAULT 'draft',
        platform TEXT,
        post_id TEXT,
        published_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        error_log TEXT
      )
    `);

    // Create Settings/Config table (optional, for DB-based config)
    db.run(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
  });
}

// Helper methods to interact with DB using Promises
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export default db;
