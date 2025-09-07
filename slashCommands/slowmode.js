// slashCommands/slowmode.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set a slowmode delay for the current channel')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('Number of seconds for slowmode (0 to disable)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // Mods/Admins only

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    const channel = interaction.channel;

    try {
      await channel.setRateLimitPerUser(seconds);

      const embed = new EmbedBuilder()
        .setTitle('🐢 Slowmode Updated')
        .setDescription(
          seconds === 0
            ? '✅ Slowmode has been **disabled** in this channel.'
            : `✅ Slowmode set to **${seconds} seconds** in this channel.`
        )
        .setColor(0x00AEEF)
        .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('Could not update slowmode. Make sure I have the right permissions.')
        .setColor(0xff0000)
        .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};