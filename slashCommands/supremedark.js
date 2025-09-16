const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("supremedark")
    .setDescription("Generate a Supreme logo (dark theme)")
    .addStringOption(opt =>
      opt.setName("text").setDescription("Text for the logo").setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString("text");
    await interaction.deferReply();

    try {
      const res = await fetch(`https://api.popcat.xyz/supreme?text=${encodeURIComponent(text)}&dark=true`);
      const data = await res.buffer();

      const attachment = new AttachmentBuilder(data, { name: "supreme_dark.png" });

      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error("Error in /supremedark:", error);
      await interaction.editReply("❌ Could not generate supreme dark logo.");
    }
  },
};