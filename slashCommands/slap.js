const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap another user 👋")
    .addUserOption(option =>
      option.setName("user").setDescription("The user to slap").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const userAvatar = interaction.user.displayAvatarURL({ extension: "png", size: 512 });
    const targetAvatar = target.displayAvatarURL({ extension: "png", size: 512 });

    const imageUrl = `https://some-random-api.com/canvas/slap?avatar1=${userAvatar}&avatar2=${targetAvatar}`;

    const embed = new EmbedBuilder()
      .setColor(0xff5555)
      .setTitle(`👋 ${interaction.user.username} slapped ${target.username}!`)
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};