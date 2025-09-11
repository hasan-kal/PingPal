const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coffee")
    .setDescription("Give someone a coffee ☕")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("The user you want to give coffee to")
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const embed = new EmbedBuilder()
      .setColor(0x8b4513)
      .setDescription(
        target
          ? `☕ ${interaction.user} gives coffee to ${target}!`
          : `☕ ${interaction.user} is having some coffee!`
      )
      .setImage("https://i.imgur.com/8bT8hSk.gif");

    await interaction.reply({ embeds: [embed] });
  },
};