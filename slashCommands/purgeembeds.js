// slashCommands/purgeembeds.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purgeembeds')
    .setDescription('Delete the last X messages that contain embeds')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to check (max 100)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const channel = interaction.channel;

    if (amount > 100) {
      return interaction.reply({ content: '❌ You can only purge up to 100 messages at once.', ephemeral: true });
    }

    const messages = await channel.messages.fetch({ limit: amount });
    const embedMessages = messages.filter(msg => msg.embeds.length > 0);

    await channel.bulkDelete(embedMessages, true);

    const embed = new EmbedBuilder()
      .setTitle('📰 Purge Embeds')
      .setDescription(`✅ Deleted **${embedMessages.size}** messages with embeds.`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};