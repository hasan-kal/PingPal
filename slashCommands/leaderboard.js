
const { SlashCommandBuilder } = require("discord.js");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the top 10 users with the highest XP"),
  async execute(interaction) {
    try {
      // Fetch top 10 users ordered by XP descending
      const topUsers = db.prepare("SELECT * FROM users ORDER BY xp DESC LIMIT 10").all();

      if (!topUsers.length) {
        return interaction.reply("📊 No users have XP yet.");
      }

      let leaderboard = "";
      topUsers.forEach((user, index) => {
        leaderboard += `**${index + 1}.** <@${user.id}> — Level: ${user.level}, XP: ${user.xp}\n`;
      });

      await interaction.reply({
        content: "🏆 **PingPal Leaderboard**\n\n" + leaderboard,
      });
    } catch (error) {
      console.error("Leaderboard command error:", error);
      await interaction.reply("❌ Could not fetch the leaderboard.");
    }
  },
};