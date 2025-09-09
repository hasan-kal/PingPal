// events/messageCreate.js
const { EmbedBuilder } = require("discord.js");
const db = require("../database.js");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const guildId = message.guild.id;
    const userId = message.author.id;

    try {
      // --- 1. If the message author was AFK, remove it ---
      const afk = db.get(
        "SELECT * FROM afk WHERE user_id = ? AND guild_id = ?",
        [userId, guildId]
      );

      if (afk) {
        // Delete from DB
        db.run("DELETE FROM afk WHERE user_id = ? AND guild_id = ?", [
          userId,
          guildId,
        ]);

        // Restore nickname (remove [AFK] prefix)
        try {
          if (message.member && message.member.manageable) {
            const currentName = message.member.nickname || message.author.username;
            if (currentName.startsWith("[AFK]")) {
              const newName = currentName.replace(/^\[AFK\]\s*/, "");
              await message.member.setNickname(newName);
            }
          }
        } catch (err) {
          console.error("⚠️ Could not restore nickname:", err.message);
        }

        // Public “welcome back” message
        await message.channel.send(
          `👋 <@${userId}> welcome back! Your AFK status has been removed.`
        );
      }

      // --- 2. Check if any mentioned users are AFK ---
      for (const user of message.mentions.users.values()) {
        const mentionedAfk = db.get(
          "SELECT * FROM afk WHERE user_id = ? AND guild_id = ?",
          [user.id, guildId]
        );
        if (mentionedAfk) {
          await message.channel.send(
            `💤 <@${user.id}> is currently AFK: ${mentionedAfk.reason || "No reason given"}`
          );
        }
      }

      // --- 3. (Keep your XP/level code here) ---
      // not rewriting XP system since that part is already working for you
    } catch (err) {
      console.error("❌ Error in messageCreate AFK handling:", err);
    }
  },
};