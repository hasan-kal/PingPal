const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Display information about the server"),
  async execute(interaction) {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
      .setTitle(`🌍 ${guild.name} Info`)
      .setColor(0x00AEEF)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "🆔 Server ID", value: guild.id, inline: true },
        { name: "👑 Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
        { name: "📅 Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: false },
        { name: "💎 Boost Tier", value: `${guild.premiumTier}`, inline: true },
        { name: "⚡ Boost Count", value: `${guild.premiumSubscriptionCount}`, inline: true }
      )
      .setFooter({ text: "PingPal • 2025", iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};