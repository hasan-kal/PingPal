const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check your level and XP progress.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Check rank of another user")
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(target.id);

    if (!user) {
      return interaction.reply({ content: `❌ ${target.username} has no XP yet.`, ephemeral: true });
    }

    const xpForNext = user.level * 100; // 100 XP per level
    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`📊 Rank of ${target.username}`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: "Level", value: `${user.level}`, inline: true },
        { name: "XP", value: `${user.xp} / ${xpForNext}`, inline: true }
      )
      .setFooter({ text: `Keep chatting to gain XP!` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};