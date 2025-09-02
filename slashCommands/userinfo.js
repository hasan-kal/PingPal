const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Display information about a user")
    .addUserOption(option => option.setName("user").setDescription("User to show info of").setRequired(false)),
  async execute(interaction) {
    const member = interaction.options.getMember("user") || interaction.member;

    const embed = {
      color: 0x0099ff,
      title: `${member.user.tag} Info`,
      thumbnail: { url: member.user.displayAvatarURL({ dynamic: true }) },
      fields: [
        { name: "User ID", value: member.id, inline: true },
        { name: "Joined Discord", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: "Roles", value: member.roles.cache.map(r => r.name).filter(r => r !== "@everyone").join(", ") || "None", inline: false }
      ]
    };

    await interaction.reply({ embeds: [embed] });
  },
};