// slashCommands/msg.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('msg')
    .setDescription('Make the bot send a custom message')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('The message you want the bot to send')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Only mods/admins

  async execute(interaction) {
    const content = interaction.options.getString('content');

    const embed = new EmbedBuilder()
      .setTitle('📩 Message Sent')
      .setDescription(`✅ Your message has been delivered:\n\n${content}`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    // Reply to the mod privately
    await interaction.reply({ embeds: [embed], ephemeral: true });

    // Send the actual message to the channel
    await interaction.channel.send(content);
  }
};