const { SlashCommandBuilder } = require("discord.js");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check your PingPal XP & Level"),
  async execute(interaction) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(interaction.user.id);

    if (!user) {
      return interaction.reply("❌ You don't have a profile yet. Start chatting to earn XP!");
    }

    const embed = {
      color: 0x00ff99,
      title: `${interaction.user.username}'s Profile`,
      fields: [
        { name: "⭐ Level", value: user.level.toString(), inline: true },
        { name: "⚡ XP", value: user.xp.toString(), inline: true },
      ],
      footer: { text: "PingPal XP System" },
    };

    await interaction.reply({ embeds: [embed] });
  },
};