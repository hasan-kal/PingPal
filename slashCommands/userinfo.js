const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Display information about a user")
    .addUserOption(option => option.setName("user").setDescription("User to show info of").setRequired(false)),
  async execute(interaction) {
    const member = interaction.options.getMember("user") || interaction.member;

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${member.user.tag} Info`)
      .setColor(0x00AEEF)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "🆔 User ID", value: member.id, inline: true },
        { name: "📅 Joined Discord", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: "📅 Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: "🎨 Roles", value: member.roles.cache.map(r => r.name).filter(r => r !== "@everyone").join(", ") || "None", inline: false }
      )
      .setFooter({ text: "PingPal • 2025", iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};