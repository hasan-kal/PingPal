const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wave")
    .setDescription("Wave at someone!"),

  async execute(interaction) {
    const res = await fetch("https://nekos.best/api/v2/wave");
    const data = await res.json();

    const gif = data.results[0].url;

    const embed = new EmbedBuilder()
      .setColor(0x00ffff)
      .setDescription(`👋 ${interaction.user} waves!`)
      .setImage(gif);

    await interaction.reply({ embeds: [embed] });
  },
};