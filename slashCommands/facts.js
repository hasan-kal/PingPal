const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("facts")
    .setDescription("Generate a facts meme with your text")
    .addStringOption(option =>
      option.setName("text").setDescription("The fact to display").setRequired(true)
    ),

  async execute(interaction) {
    const text = encodeURIComponent(interaction.options.getString("text"));
    const imageUrl = `https://some-random-api.com/canvas/fact?text=${text}`;

    const embed = new EmbedBuilder()
      .setColor(0x66ff66)
      .setTitle("📜 Fact Check")
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};