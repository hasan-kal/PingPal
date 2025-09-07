// slashCommands/lockdown.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock or unlock the current channel')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Choose to lock or unlock')
        .setRequired(true)
        .addChoices(
          { name: 'Lock', value: 'lock' },
          { name: 'Unlock', value: 'unlock' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const action = interaction.options.getString('action');
    const channel = interaction.channel;

    try {
      if (action === 'lock') {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: false,
        });

        const embed = new EmbedBuilder()
          .setTitle('🔒 Channel Locked')
          .setDescription(`✅ Channel **#${channel.name}** has been locked. Members cannot send messages now.`)
          .setColor(0xff0000)
          .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      } else {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: null, // reset permission
        });

        const embed = new EmbedBuilder()
          .setTitle('🔓 Channel Unlocked')
          .setDescription(`✅ Channel **#${channel.name}** has been unlocked. Members can send messages again.`)
          .setColor(0x00AEEF)
          .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Could not update channel permissions. Make sure I have `Manage Channels` permission.')
        .setColor(0xff0000)
        .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};