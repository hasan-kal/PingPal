// slashCommands/leaderboard.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the server XP leaderboard')
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of top users to show (max 25)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const guildId = interaction.guild?.id;
    if (!guildId) {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        ephemeral: true,
      });
    }

    const limit = Math.min(25, Math.max(3, interaction.options.getInteger('limit') || 10)); // default 10, clamp 3..25

    try {
      // ⚡ better-sqlite3 is synchronous — no await needed
      const rows = db.all(
        "SELECT user_id, xp, level FROM users WHERE guild_id = ? ORDER BY xp DESC LIMIT ?",
        [guildId, limit]
      );

      if (!rows || rows.length === 0) {
        return interaction.reply({
          content: 'No leaderboard data yet—encourage members to chat to gain XP!',
          ephemeral: true,
        });
      }

      // Build leaderboard text
      const lines = [];
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        let display = `<@${r.user_id}>`;
        try {
          const member = await interaction.guild.members.fetch(r.user_id).catch(() => null);
          if (member) display = member.displayName;
        } catch {
          // fallback stays as <@id>
        }
        lines.push(`**#${i + 1} • ${display}** — ${r.xp} XP (Lvl ${r.level})`);
      }

      const embed = new EmbedBuilder()
        .setTitle('🏆 Server Leaderboard')
        .setDescription(lines.join('\n'))
        .setTimestamp()
        .setColor(0xffd700)
        .setFooter({ text: `Top ${rows.length}`, iconURL: interaction.client.user.displayAvatarURL() });

      return interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error in /leaderboard command:', err);
      return interaction.reply({
        content: '⚠️ Could not fetch the leaderboard. Please try again later.',
        ephemeral: true,
      });
    }
  },
};