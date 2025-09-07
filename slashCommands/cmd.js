const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cmd')
    .setDescription('Shows a quick list of commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📜 Command List')
      .setDescription('Here is a quick list of some core commands:\n`ping, hello, repeat, help, invite, about`')
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};