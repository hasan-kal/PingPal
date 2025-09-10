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
      // --- XP SYSTEM ---
      const xpToAdd = Math.floor(Math.random() * 10) + 5; // 5–15 XP per message
      let user = db.get(
        "SELECT * FROM users WHERE user_id = ? AND guild_id = ?",
        [userId, guildId]
      );

      if (!user) {
        db.run(
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
        db.run(
          "UPDATE users SET xp = ?, level = ? WHERE user_id = ? AND guild_id = ?",
          [newXP, newLevel, userId, guildId]
        );
      }

      // --- PREFIX COMMANDS ---
      const prefix = "!";
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
      console.error("❌ Error in messageCreate:", err);
    }
  },
};