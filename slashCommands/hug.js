// slashCommands/hug.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Send a hug GIF to someone!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user you want to hug')
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const res = await fetch('https://nekos.best/api/v2/hug');
    const data = await res.json();

    const gif = data.results[0].url;

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setDescription(`🤗 ${interaction.user} gives ${target} a big hug!`)
      .setImage(gif);

    await interaction.reply({ embeds: [embed] });
  },
};