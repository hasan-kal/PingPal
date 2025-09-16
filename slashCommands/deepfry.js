// Example deepfry.js
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deepfry')
    .setDescription('Deepfry an image')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User whose avatar to deepfry')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512 });

    try {
      const response = await fetch(`https://nekobot.xyz/api/imagegen?type=deepfry&image=${encodeURIComponent(avatarURL)}`);
      const data = await response.json();

      if (!data || !data.message) {
        return interaction.reply({ content: '❌ Failed to deepfry image.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle(`🍟 Deepfried ${user.username}`)
        .setImage(data.message) // API gives direct image URL
        .setColor(0xffa500);

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      interaction.reply({ content: '❌ Error deepfrying image.', ephemeral: true });
    }
  }
};