const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency"),
  async execute(interaction) {
    const sent = await interaction.reply({ content: "🏓 Pinging...", fetchReply: true });
    await interaction.editReply(`🏓 Pong! Latency is ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  },
};