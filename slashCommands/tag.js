// slashCommands/tag.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription('View a tag')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Tag name to view')
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name');
    const row = db.get(`SELECT * FROM tags WHERE guild_id = ? AND name = ?`,
      [interaction.guild.id, name]);

    if (!row) return interaction.reply({ content: '❌ Tag not found.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`🏷️ ${row.name}`)
      .setDescription(row.content)
      .setColor(0x00AEEF)
      .setFooter({ text: `Created by ${interaction.guild.members.cache.get(row.user_id)?.user.tag || 'Unknown'}`, iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};