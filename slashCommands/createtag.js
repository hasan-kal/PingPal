// slashCommands/createtag.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createtag')
    .setDescription('Create a personal tag')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Tag name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('content')
        .setDescription('Tag content')
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name');
    const content = interaction.options.getString('content');

    const existing = db.get(`SELECT * FROM tags WHERE guild_id = ? AND name = ?`, [interaction.guild.id, name]);
    if (existing) return interaction.reply({ content: '❌ A tag with that name already exists.', ephemeral: true });

    db.run(`INSERT INTO tags (guild_id, user_id, name, content) VALUES (?, ?, ?, ?)`,
      [interaction.guild.id, interaction.user.id, name, content]);

    const embed = new EmbedBuilder()
      .setTitle('🏷️ Tag Created')
      .setDescription(`✅ Tag **${name}** has been created.`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};