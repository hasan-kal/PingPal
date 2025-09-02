const Database = require("better-sqlite3");

// Create or open a database file
const db = new Database("pingpal.db");

// Create a users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
  )
`).run();

console.log("✅ Database connected and users table ready.");

module.exports = db;