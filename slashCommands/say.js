const { SlashCommandBuilder } = require("discord.js");

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

    await interaction.reply({ content: msg });
  },
};