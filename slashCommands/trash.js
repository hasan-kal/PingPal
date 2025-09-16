const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trash")
    .setDescription("Put a user's avatar in the trash 🗑️")
    .addUserOption(opt =>
      opt.setName("user").setDescription("User to trash").setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    await interaction.deferReply();

    try {
      const avatar = user.displayAvatarURL({ format: "png", size: 512 });
      const res = await fetch(`https://api.popcat.xyz/trash?image=${encodeURIComponent(avatar)}`);
      const data = await res.buffer();

      const attachment = new AttachmentBuilder(data, { name: "trash.png" });

      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error("Error in /trash:", error);
      await interaction.editReply("❌ Could not generate trash image.");
    }
  },
};