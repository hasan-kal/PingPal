const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("supremedark")
    .setDescription("Generate a dark Supreme logo image")
    .addStringOption(option =>
      option.setName("text").setDescription("The text to make Supreme Dark").setRequired(true)
    ),

  async execute(interaction) {
    const text = encodeURIComponent(interaction.options.getString("text"));
    const imageUrl = `https://some-random-api.com/canvas/supreme?text=${text}&dark=true`;

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("⬛ Supreme Dark Style")
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};