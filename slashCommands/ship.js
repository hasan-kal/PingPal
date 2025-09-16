const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Ship yourself with another user 💖")
    .addUserOption(option =>
      option.setName("user").setDescription("Who to ship with").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const userAvatar = interaction.user.displayAvatarURL({ extension: "png", size: 512 });
    const targetAvatar = target.displayAvatarURL({ extension: "png", size: 512 });

    const imageUrl = `https://some-random-api.com/canvas/ship?avatar1=${userAvatar}&avatar2=${targetAvatar}`;

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle(`💘 ${interaction.user.username} ❤️ ${target.username}`)
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};