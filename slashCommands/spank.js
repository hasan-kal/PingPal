const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spank")
    .setDescription("Spank another user 🍑")
    .addUserOption(option =>
      option.setName("user").setDescription("The user to spank").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const userAvatar = interaction.user.displayAvatarURL({ extension: "png", size: 512 });
    const targetAvatar = target.displayAvatarURL({ extension: "png", size: 512 });

    const imageUrl = `https://some-random-api.com/canvas/spank?avatar1=${userAvatar}&avatar2=${targetAvatar}`;

    const embed = new EmbedBuilder()
      .setColor(0xffa500)
      .setTitle(`🍑 ${interaction.user.username} spanked ${target.username}!`)
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};