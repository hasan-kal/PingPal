const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Display a user's avatar")
    .addUserOption(option => option.setName("user").setDescription("User to show avatar of").setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    await interaction.reply({ content: `${user.tag}'s avatar: ${user.displayAvatarURL({ dynamic: true, size: 1024 })}` });
  },
};