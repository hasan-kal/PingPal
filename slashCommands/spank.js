const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spank")
    .setDescription("Spank someone 👀")
    .addUserOption(opt =>
      opt.setName("target").setDescription("User to spank").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    await interaction.deferReply();

    try {
      const res = await fetch("https://api.waifu.pics/sfw/spank");
      const data = await res.json();

      const img = await fetch(data.url);
      const buffer = await img.buffer();

      const attachment = new AttachmentBuilder(buffer, { name: "spank.png" });

      await interaction.editReply({
        content: `🍑 ${interaction.user} spanked ${target}!`,
        files: [attachment],
      });
    } catch (error) {
      console.error("Error in /spank:", error);
      await interaction.editReply("❌ Could not fetch spank image.");
    }
  },
};