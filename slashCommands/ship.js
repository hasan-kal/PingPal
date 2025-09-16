const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Ship two users together ❤️")
    .addUserOption(opt => opt.setName("user1").setDescription("First user").setRequired(true))
    .addUserOption(opt => opt.setName("user2").setDescription("Second user").setRequired(true)),

  async execute(interaction) {
    const user1 = interaction.options.getUser("user1");
    const user2 = interaction.options.getUser("user2");
    await interaction.deferReply();

    try {
      const avatar1 = user1.displayAvatarURL({ format: "png", size: 512 });
      const avatar2 = user2.displayAvatarURL({ format: "png", size: 512 });

      const res = await fetch(`https://api.popcat.xyz/ship?user1=${encodeURIComponent(avatar1)}&user2=${encodeURIComponent(avatar2)}`);
      const data = await res.buffer();

      const attachment = new AttachmentBuilder(data, { name: "ship.png" });

      await interaction.editReply({
        content: `💘 **${user1.username}** + **${user2.username}** = OTP ❤️`,
        files: [attachment],
      });
    } catch (error) {
      console.error("Error in /ship:", error);
      await interaction.editReply("❌ Could not generate ship image.");
    }
  },
};