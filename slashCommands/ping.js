const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency"),

  async execute(interaction) {
    try {
      const sent = await interaction.reply({ content: "🏓 Pinging...", fetchReply: true });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;

      const embed = new EmbedBuilder()
        .setTitle("🏓 Pong!")
        .setDescription(`Bot Latency: **${latency}ms**`)
        .setColor(0x00AEEF)
        .setFooter({ text: "PingPal • 2025", iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      await interaction.editReply({ content: null, embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
      }
    }
  }
};