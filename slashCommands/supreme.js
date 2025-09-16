const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("supreme")
    .setDescription("Generate a Supreme logo style image")
    .addStringOption(option =>
      option.setName("text").setDescription("The text to make Supreme").setRequired(true)
    ),

  async execute(interaction) {
    const text = encodeURIComponent(interaction.options.getString("text"));
    const imageUrl = `https://some-random-api.com/canvas/supreme?text=${text}&dark=false`;

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("🟥 Supreme Style")
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};