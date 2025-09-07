// slashCommands/guildleave.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guildleave')
    .setDescription('Make the bot leave this server (only the server owner can use this)'),

  async execute(interaction) {
    const guild = interaction.guild;

    if (interaction.user.id !== guild.ownerId) {
      const noPermEmbed = new EmbedBuilder()
        .setTitle('❌ Permission Denied')
        .setDescription('Only the **server owner** can make PingPal leave this server.')
        .setColor(0xff0000)
        .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      return interaction.reply({ embeds: [noPermEmbed], ephemeral: true });
    }

    const leaveEmbed = new EmbedBuilder()
      .setTitle('👋 Leaving Server')
      .setDescription(`PingPal is leaving **${guild.name}**. Thanks for having me!`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [leaveEmbed] });

    setTimeout(() => guild.leave(), 3000);
  }
};