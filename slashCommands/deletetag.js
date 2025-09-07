// slashCommands/deletetag.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletetag')
    .setDescription('Delete a tag you created')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Tag name')
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name');

    const tag = db.get(`SELECT * FROM tags WHERE guild_id = ? AND name = ? AND user_id = ?`,
      [interaction.guild.id, name, interaction.user.id]);
    if (!tag) return interaction.reply({ content: '❌ Tag not found or you are not the owner.', ephemeral: true });

    db.run(`DELETE FROM tags WHERE guild_id = ? AND name = ? AND user_id = ?`,
      [interaction.guild.id, name, interaction.user.id]);

    const embed = new EmbedBuilder()
      .setTitle('🗑️ Tag Deleted')
      .setDescription(`✅ Tag **${name}** has been deleted.`)
      .setColor(0xff0000)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};