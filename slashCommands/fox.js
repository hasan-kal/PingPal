const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fox")
    .setDescription("Get a random fox picture 🦊"),

  async execute(interaction) {
    const res = await fetch("https://some-random-api.com/img/fox");
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setColor(0xff6600)
      .setTitle("🦊 Here’s a fox!")
      .setImage(data.link);

    await interaction.reply({ embeds: [embed] });
  },
};