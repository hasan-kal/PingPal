const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blur")
    .setDescription("Blur a user's avatar")
    .addUserOption(option =>
      option.setName("user").setDescription("Whose avatar to blur").setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const avatar = target.displayAvatarURL({ extension: "png", size: 512 });

    try {
      const response = await fetch(`https://some-random-api.com/canvas/blur?avatar=${avatar}`);
      const buffer = await response.arrayBuffer();
      const file = new AttachmentBuilder(Buffer.from(buffer), { name: "blur.png" });
      await interaction.reply({ files: [file] });
    } catch (err) {
      console.error("❌ Blur error:", err);
      await interaction.reply({ content: "⚠️ Couldn't blur avatar.", ephemeral: true });
    }
  },
};