// slashCommands/cat.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Get a random cat picture 🐱'),

  async execute(interaction) {
    const res = await fetch('https://some-random-api.com/img/cat');
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setColor(0x00aaff)
      .setTitle('🐱 Here’s a cute cat!')
      .setImage(data.link);

    await interaction.reply({ embeds: [embed] });
  },
};