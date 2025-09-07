// slashCommands/purgeimages.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purgeimages')
    .setDescription('Delete the last X messages that contain images')
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
    const imageMessages = messages.filter(msg =>
      msg.attachments.size > 0 || msg.embeds.some(embed => embed.image || embed.thumbnail)
    );

    await channel.bulkDelete(imageMessages, true);

    const embed = new EmbedBuilder()
      .setTitle('🖼️ Purge Images')
      .setDescription(`✅ Deleted **${imageMessages.size}** messages with images.`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};