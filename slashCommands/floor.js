const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("floor")
    .setDescription("Send a 'floor gang' meme"),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const res = await fetch("https://api.popcat.xyz/floor");
      const data = await res.buffer();

      const attachment = new AttachmentBuilder(data, { name: "floor.png" });

      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error("Error in /floor:", error);
      await interaction.editReply("❌ Could not generate floor image.");
    }
  },
};