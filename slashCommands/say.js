const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Echo a message")
    .addStringOption(option =>
      option.setName("message")
            .setDescription("Message to say")
            .setRequired(true)
    ),
  async execute(interaction) {
    const msg = interaction.options.getString("message");

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("📢 PingPal Says")
      .setDescription(msg)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};