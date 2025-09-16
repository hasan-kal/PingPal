const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("salty")
    .setDescription("Generate a salty meme with a user's avatar")
    .addUserOption(option =>
      option.setName("user").setDescription("Whose avatar to use").setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const avatar = target.displayAvatarURL({ extension: "png", size: 512 });
    const imageUrl = `https://some-random-api.com/canvas/salty?avatar=${avatar}`;

    const embed = new EmbedBuilder()
      .setColor(0x1e90ff)
      .setTitle(`🧂 ${target.username} is feeling salty!`)
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};