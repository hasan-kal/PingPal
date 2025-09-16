const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deepfry")
    .setDescription("Deepfry a user's avatar")
    .addUserOption(option =>
      option.setName("user").setDescription("Whose avatar to deepfry").setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const avatar = target.displayAvatarURL({ extension: "png", size: 512 });

    const imageUrl = `https://some-random-api.com/canvas/deepfry?avatar=${avatar}`;

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle(`🔥 Deepfried Avatar of ${target.username}`)
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};