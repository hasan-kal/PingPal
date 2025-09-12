const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fbi")
    .setDescription("Call the FBI 🚨"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x0000ff)
      .setTitle("🚨 FBI OPEN UP!")
      .setImage("https://i.imgur.com/U5PpGRV.gif");

    await interaction.reply({ embeds: [embed] });
  },
};