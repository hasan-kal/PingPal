// slashCommands/coffee.js
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
    try {
      const target = interaction.options.getUser("user");
      const embed = new EmbedBuilder()
        .setColor(0x8b4513)
        .setDescription(
          target
            ? `☕ ${interaction.user} gives coffee to ${target}!`
            : `☕ ${interaction.user} is having some coffee!`
        )
        .setImage("https://i.imgur.com/IoX9WZs.gif"); // ✅ new working GIF

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("❌ Coffee command error:", err);
      await interaction.reply({
        content: "⚠️ Couldn't load a coffee GIF right now. Try again later!",
        ephemeral: true,
      });
    }
  },
};