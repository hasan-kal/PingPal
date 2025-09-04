const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Display a user's avatar")
    .addUserOption(option => 
      option.setName("user")
        .setDescription("User to show avatar of")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`🖼 Avatar of ${user.username}`)
      .setColor(0x00AEEF)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setFooter({ text: "PingPal • 2025", iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};