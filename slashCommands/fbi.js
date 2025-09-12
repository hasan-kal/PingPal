// slashCommands/fbi.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fbi")
    .setDescription("Call the FBI 🚨"),

  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x0000ff)
        .setTitle("🚨 FBI OPEN UP!")
        .setImage("https://i.imgur.com/cGJb3ZR.gif"); // ✅ reliable FBI meme GIF

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("❌ FBI command error:", err);
      await interaction.reply({
        content: "⚠️ Couldn't load the FBI GIF right now. Try again later!",
        ephemeral: true,
      });
    }
  },
};