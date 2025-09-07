// slashCommands/channelstats.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelstats')
    .setDescription('View stats about the current channel'),

  async execute(interaction) {
    const channel = interaction.channel;

    const embed = new EmbedBuilder()
      .setTitle('📊 Channel Stats')
      .addFields(
        { name: 'Name', value: `${channel.name}`, inline: true },
        { name: 'ID', value: `${channel.id}`, inline: true },
        { name: 'Type', value: `${channel.type}`, inline: true },
        { name: 'Created On', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`, inline: false },
        { name: 'NSFW', value: channel.nsfw ? '✅ Yes' : '❌ No', inline: true },
        { name: 'Category', value: channel.parent ? channel.parent.name : 'None', inline: true }
      )
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};