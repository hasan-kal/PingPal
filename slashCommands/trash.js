const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trash")
    .setDescription("Put a user's avatar in the trash 🗑️")
    .addUserOption(option =>
      option.setName("user").setDescription("The user to throw in trash").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const avatar = target.displayAvatarURL({ extension: "png", size: 512 });
    const imageUrl = `https://some-random-api.com/canvas/trash?avatar=${avatar}`;

    const embed = new EmbedBuilder()
      .setColor(0x999999)
      .setTitle(`🗑️ ${target.username} is now in the trash!`)
      .setImage(imageUrl);

    await interaction.reply({ embeds: [embed] });
  },
};