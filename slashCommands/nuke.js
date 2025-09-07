// slashCommands/nuke.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Nuke the current channel (deletes and recreates it)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // Only mods/admins
  async execute(interaction) {
    const channel = interaction.channel;

    const confirmEmbed = new EmbedBuilder()
      .setTitle('💣 Nuke Incoming!')
      .setDescription(`Channel **#${channel.name}** will be nuked in 3 seconds!`)
      .setColor(0xff0000)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [confirmEmbed] });

    setTimeout(async () => {
      const newChannel = await channel.clone();
      await channel.delete();

      const nukedEmbed = new EmbedBuilder()
        .setTitle('☢️ Channel Nuked')
        .setDescription(`This channel has been nuked and recreated!`)
        .setColor(0x00AEEF)
        .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      await newChannel.send({ embeds: [nukedEmbed] });
    }, 3000);
  }
};