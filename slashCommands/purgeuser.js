// slashCommands/purgeuser.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purgeuser')
    .setDescription('Delete the last X messages from a specific user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User whose messages you want to delete')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to check (max 100)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const amount = interaction.options.getInteger('amount');
    const channel = interaction.channel;

    if (amount > 100) {
      return interaction.reply({ content: '❌ You can only purge up to 100 messages at once.', ephemeral: true });
    }

    const messages = await channel.messages.fetch({ limit: amount });
    const userMessages = messages.filter(msg => msg.author.id === target.id);

    await channel.bulkDelete(userMessages, true);

    const embed = new EmbedBuilder()
      .setTitle('👤 Purge User')
      .setDescription(`✅ Deleted **${userMessages.size}** messages from ${target}.`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};