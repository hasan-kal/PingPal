const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Shows information about PingPal bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 About PingPal')
      .setDescription('PingPal is a fun and utility Discord bot made to enhance your server experience!\n\n• Version: 1.0.0\n• Developer: trashnewaccplsfollow')
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};