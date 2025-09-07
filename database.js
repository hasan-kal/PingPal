const Database = require("better-sqlite3");

// Open or create database
const db = new Database("pingpal.db");

// Users table for XP & levels (server-specific)
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    PRIMARY KEY (user_id, guild_id)
  )
`).run();

// Tags table for Memory category
db.prepare(`
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// AFK table
db.prepare(`
  CREATE TABLE IF NOT EXISTS afk (
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    reason TEXT,
    since TEXT,
    PRIMARY KEY (user_id, guild_id)
  )
`).run();

console.log("✅ Database connected and tables ready.");

// Helper functions
module.exports = {
  db,
  run: (sql, params = []) => db.prepare(sql).run(params),
  get: (sql, params = []) => db.prepare(sql).get(params),
  all: (sql, params = []) => db.prepare(sql).all(params)
};