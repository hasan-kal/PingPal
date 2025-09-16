// slashCommands/slap.js
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap another user 👋")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("The user you want to slap")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const userAvatar = interaction.user.displayAvatarURL({ extension: "png", size: 512 });
    const targetAvatar = target.displayAvatarURL({ extension: "png", size: 512 });

    try {
      const response = await fetch(
        `https://some-random-api.com/canvas/slap?avatar1=${userAvatar}&avatar2=${targetAvatar}`
      );
      const buffer = await response.arrayBuffer();

      const file = new AttachmentBuilder(Buffer.from(buffer), { name: "slap.png" });

      await interaction.reply({ files: [file] });
    } catch (err) {
      console.error("❌ Slap command error:", err);
      await interaction.reply({
        content: "⚠️ Couldn't generate the slap image right now. Try again later!",
        ephemeral: true,
      });
    }
  },
};