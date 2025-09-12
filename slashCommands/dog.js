const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Get a random dog picture 🐶"),

  async execute(interaction) {
    const res = await fetch("https://some-random-api.com/img/dog");
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setColor(0xffa500)
      .setTitle("🐶 Here’s a cute dog!")
      .setImage(data.link);

    await interaction.reply({ embeds: [embed] });
  },
};