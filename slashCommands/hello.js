const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Say hello to the bot!'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('👋 Hello!')
      .setDescription(`Hello ${interaction.user.username}! Glad to see you.`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};