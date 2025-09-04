const { EmbedBuilder } = require("discord.js");
const prefix = "!"; 
const db = require("../utils/database"); // adjust path if needed

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    // --- XP SYSTEM ---
    const xpToAdd = Math.floor(Math.random() * 10) + 5; // Random XP 5–15
    let user = await db.get("SELECT * FROM users WHERE user_id = ?", [message.author.id]);

    if (!user) {
      await db.run("INSERT INTO users (user_id, xp, level) VALUES (?, ?, ?)", [
        message.author.id,
        xpToAdd,
        1,
      ]);
      user = { user_id: message.author.id, xp: xpToAdd, level: 1 };
    } else {
      const newXP = user.xp + xpToAdd;
      const newLevel = Math.floor(newXP / 100) + 1; // Example: 100 XP = 1 level
      if (newLevel > user.level) {
        const levelUpEmbed = new EmbedBuilder()
          .setColor(0xFFD700)
          .setTitle("🎉 Level Up!")
          .setDescription(`Congrats <@${message.author.id}>! You reached **Level ${newLevel}**!`)
          .setThumbnail(message.author.displayAvatarURL())
          .setTimestamp();

        message.channel.send({ embeds: [levelUpEmbed] });
      }
      await db.run("UPDATE users SET xp = ?, level = ? WHERE user_id = ?", [
        newXP,
        newLevel,
        message.author.id,
      ]);
    }

    // --- PREFIX COMMANDS ---
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = message.client.commands.get(commandName);
    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("❌ Oops! There was an error running that command.");
    }
  },
};