// scripts/check-db.js
const db = require("../database"); // adjust path if you run from repo root as shown
const [,, guildId, userId] = process.argv;

if (!guildId) {
  console.error("Usage: node scripts/check-db.js <GUILD_ID> [USER_ID]");
  process.exit(1);
}

if (userId) {
  const row = db.prepare("SELECT * FROM users WHERE guild_id = ? AND user_id = ?").get(guildId, userId);
  console.log("Row for user:", row);
} else {
  const rows = db.prepare("SELECT user_id, xp, level FROM users WHERE guild_id = ? ORDER BY level DESC, xp DESC LIMIT 50").all(guildId);
  console.log(`Found ${rows.length} rows for guild ${guildId}`);
  console.table(rows);
}