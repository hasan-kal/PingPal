const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("salty")
    .setDescription("Generate a salty meme")
    .addUserOption(option =>
      option.setName("user").setDescription("User to make salty").setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    await interaction.deferReply();

    try {
      const avatar = user.displayAvatarURL({ format: "png", size: 512 });
      const res = await fetch(`https://api.popcat.xyz/salty?image=${encodeURIComponent(avatar)}`);
      const data = await res.buffer();

      const attachment = new AttachmentBuilder(data, { name: "salty.png" });

      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error("Error in /salty:", error);
      await interaction.editReply("❌ Could not generate salty image.");
    }
  },
};