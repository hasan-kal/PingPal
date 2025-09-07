// slashCommands/alltags.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alltags')
    .setDescription('Get a list of all tags in this server (sent via DM)'),

  async execute(interaction) {
    try {
      const rows = db.all(`SELECT name, user_id FROM tags WHERE guild_id = ?`, [interaction.guild.id]);
      if (!rows.length) return interaction.reply({ content: '❌ No tags found in this server.', ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle(`🏷️ All Tags in ${interaction.guild.name}`)
        .setDescription(rows.map(r => `• **${r.name}** (created by <@${r.user_id}>)`).join('\n'))
        .setColor(0x00AEEF)
        .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      await interaction.user.send({ embeds: [embed] });
      await interaction.reply({ content: '📩 I have sent you all the tags in a DM!', ephemeral: true });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Could not send you a DM. Make sure your DMs are open.', ephemeral: true });
    }
  }
};