

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("📖 Shows a list of available commands"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#9b59b6")
      .setTitle("🤖 PingPal Help Menu")
      .setDescription("Here are the commands you can use with PingPal:")
      .addFields(
        { name: "/help", value: "📖 Show this help menu" },
        { name: "/roll", value: "🎲 Roll a dice (default 6 sides, can specify more)" },
        { name: "/say", value: "📢 Make the bot repeat your message" },
        { name: "/joke", value: "😂 Get a random joke" },
        { name: "/weather", value: "🌤️ Get weather info for a city" },
        { name: "/profile", value: "👤 View your profile and XP" },
        { name: "/leaderboard", value: "🏆 View the XP leaderboard" }
      )
      .setFooter({ text: "PingPal Utility Bot • Built with ❤️ using discord.js" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};