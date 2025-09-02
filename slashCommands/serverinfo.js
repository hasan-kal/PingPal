const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Display information about the server"),
  async execute(interaction) {
    const guild = interaction.guild;

    const embed = {
      color: 0x00ff00,
      title: `${guild.name} Info`,
      thumbnail: { url: guild.iconURL({ dynamic: true }) },
      fields: [
        { name: "Server ID", value: guild.id, inline: true },
        { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
        { name: "Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: false },
        { name: "Boost Tier", value: `${guild.premiumTier}`, inline: true },
        { name: "Boost Count", value: `${guild.premiumSubscriptionCount}`, inline: true }
      ]
    };

    await interaction.reply({ embeds: [embed] });
  },
};