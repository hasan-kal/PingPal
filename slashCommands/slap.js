// slashCommands/slap.js
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone with a funny image!")
    .addUserOption(option =>
      option.setName("target").setDescription("User to slap").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("target");

    await interaction.deferReply();

    try {
      // Example API (Neko API has slap endpoint)
      const res = await fetch("https://nekos.life/api/v2/img/slap");
      const data = await res.json();

      if (!data.url) {
        return interaction.editReply("❌ Could not fetch slap image.");
      }

      // Download the image and attach it
      const imageResponse = await fetch(data.url);
      const buffer = await imageResponse.arrayBuffer();
      const attachment = new AttachmentBuilder(Buffer.from(buffer), {
        name: "slap.png",
      });

      await interaction.editReply({
        content: `👋 ${interaction.user} slapped ${target}!`,
        files: [attachment],
      });
    } catch (error) {
      console.error("Error in /slap:", error);
      await interaction.editReply("❌ Something went wrong. Please try again.");
    }
  },
};