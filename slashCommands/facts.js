const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("facts")
    .setDescription("Generate a facts meme with your text")
    .addStringOption(option =>
      option.setName("text").setDescription("The fact to display").setRequired(true)
    ),

  async execute(interaction) {
    const text = encodeURIComponent(interaction.options.getString("text"));

    try {
      const response = await fetch(`https://some-random-api.com/canvas/facts?text=${text}`);
      const buffer = await response.arrayBuffer();
      const file = new AttachmentBuilder(Buffer.from(buffer), { name: "facts.png" });
      await interaction.reply({ files: [file] });
    } catch (err) {
      console.error("❌ Facts error:", err);
      await interaction.reply({ content: "⚠️ Couldn't generate facts image.", ephemeral: true });
    }
  },
};