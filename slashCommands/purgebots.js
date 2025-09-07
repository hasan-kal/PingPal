// slashCommands/purgebots.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purgebots')
    .setDescription('Delete the last X messages sent by bots')
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
    const botMessages = messages.filter(msg => msg.author.bot);

    await channel.bulkDelete(botMessages, true);

    const embed = new EmbedBuilder()
      .setTitle('🧹 Purge Bots')
      .setDescription(`✅ Deleted **${botMessages.size}** bot messages.`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};