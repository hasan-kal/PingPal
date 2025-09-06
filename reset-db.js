const db = require("./database");

// Drop the old users table
db.prepare("DROP TABLE IF EXISTS users").run();

console.log("✅ Old users table dropped. Restart your bot to recreate it with the new schema.");