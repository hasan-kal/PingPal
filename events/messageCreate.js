// events/messageCreate.js
const { EmbedBuilder } = require("discord.js");
const prefix = "!";
const db = require("../database.js"); // SQLite helper

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const guildId = message.guild.id;
    const userId = message.author.id;

    try {
      // --- AFK HANDLING ---
      // Remove AFK if the author was AFK
      const afk = await db.get(
        "SELECT * FROM afk WHERE user_id = ? AND guild_id = ?",
        [userId, guildId]
      );
      if (afk) {
        await db.run("DELETE FROM afk WHERE user_id = ? AND guild_id = ?", [
          userId,
          guildId,
        ]);

        // ✅ Remove [AFK] from nickname (or username if no nickname set)
        try {
          if (message.member && message.member.manageable) {
            const currentName = message.member.nickname || message.author.username;
            if (currentName.startsWith("[AFK]")) {
              const newName = currentName.replace(/^\[AFK\]\s*/, "");
              await message.member.setNickname(newName);
            }
          }
        } catch (err) {
          console.error("Failed to remove AFK from nickname:", err.message);
        }

        // 👋 Notify the user AND the channel
        await message.reply("👋 You’re no longer AFK.");
        await message.channel.send(
          `✅ Welcome back <@${userId}>, your AFK status has been removed!`
        );
      }

      // Notify if mentioned users are AFK
      for (const user of message.mentions.users.values()) {
        const mentionedAfk = await db.get(
          "SELECT * FROM afk WHERE user_id = ? AND guild_id = ?",
          [user.id, guildId]
        );
        if (mentionedAfk) {
          message.channel.send(
            `💤 <@${user.id}> is currently AFK: ${mentionedAfk.reason}`
          );
        }
      }

      // --- XP SYSTEM ---
      const xpToAdd = Math.floor(Math.random() * 10) + 5; // 5–15 XP per message
      let user = await db.get(
        "SELECT * FROM users WHERE user_id = ? AND guild_id = ?",
        [userId, guildId]
      );

      if (!user) {
        await db.run(
          "INSERT INTO users (user_id, guild_id, xp, level) VALUES (?, ?, ?, ?)",
          [userId, guildId, xpToAdd, 1]
        );
        user = { user_id: userId, guild_id: guildId, xp: xpToAdd, level: 1 };
      } else {
        const newXP = user.xp + xpToAdd;
        const newLevel = Math.floor(newXP / 100) + 1; // 100 XP = 1 level
        if (newLevel > user.level) {
          const levelUpEmbed = new EmbedBuilder()
            .setColor(0xffd700)
            .setTitle("🎉 Level Up!")
            .setDescription(
              `Congrats <@${userId}>! You reached **Level ${newLevel}**!`
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();
          message.channel.send({ embeds: [levelUpEmbed] });
        }
        await db.run(
          "UPDATE users SET xp = ?, level = ? WHERE user_id = ? AND guild_id = ?",
          [newXP, newLevel, userId, guildId]
        );
      }

      // --- PREFIX COMMANDS (legacy) ---
      if (!message.content.startsWith(prefix)) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = message.client.commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("❌ Oops! There was an error running that command.");
      }
    } catch (err) {
      console.error("Message handling error:", err);
    }
  },
};