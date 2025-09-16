const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("floor")
    .setDescription("Put a user's avatar on the floor 😂")
    .addUserOption(option =>
      option.setName("user").setDescription("Whose avatar to use").setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const avatar = target.displayAvatarURL({ extension: "png", size: 512 });
    const imageUrl = `https://some-random-api.com/canvas/floor?avatar=${avatar}`;

    const embed = new EmbedBuilder()
      .setColor(0xffc107)
      .setTitle(`🤣 ${target.username} is lying on the floor!`)
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};