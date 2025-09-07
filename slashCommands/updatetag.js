// slashCommands/updatetag.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updatetag')
    .setDescription('Update an existing tag you created')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Tag name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('content')
        .setDescription('New tag content')
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name');
    const content = interaction.options.getString('content');

    const tag = db.get(`SELECT * FROM tags WHERE guild_id = ? AND name = ? AND user_id = ?`,
      [interaction.guild.id, name, interaction.user.id]);
    if (!tag) return interaction.reply({ content: '❌ Tag not found or you are not the owner.', ephemeral: true });

    db.run(`UPDATE tags SET content = ? WHERE guild_id = ? AND name = ? AND user_id = ?`,
      [content, interaction.guild.id, name, interaction.user.id]);

    const embed = new EmbedBuilder()
      .setTitle('✏️ Tag Updated')
      .setDescription(`✅ Tag **${name}** has been updated.`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};