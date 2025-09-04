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
        { name: "/leaderboard", value: "🏆 View the XP leaderboard" },
        { name: "/roast", value: "🔥 Roast someone for fun" },
        { name: "/ping", value: "🏓 Check the bot's latency" },
        { name: "/userinfo", value: "👤 Get info about a user" },
        { name: "/serverinfo", value: "🌍 Get info about the server" },
        { name: "/rank", value: "📊 View your current level and XP" },
        { name: "/avatar", value: "🖼️ Show the avatar of a user" }
      )
      .setFooter({ text: "PingPal Utility Bot • Built with ❤️ using discord.js" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};