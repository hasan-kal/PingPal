const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invert")
    .setDescription("Invert a user's avatar colors")
    .addUserOption(option =>
      option.setName("user").setDescription("Whose avatar to invert").setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const avatar = target.displayAvatarURL({ extension: "png", size: 512 });

    try {
      const response = await fetch(`https://some-random-api.com/canvas/invert?avatar=${avatar}`);
      const buffer = await response.arrayBuffer();
      const file = new AttachmentBuilder(Buffer.from(buffer), { name: "invert.png" });
      await interaction.reply({ files: [file] });
    } catch (err) {
      console.error("❌ Invert error:", err);
      await interaction.reply({ content: "⚠️ Couldn't invert avatar.", ephemeral: true });
    }
  },
};