// slashCommands/rank.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Show your rank or another user\'s rank')
    .addUserOption(option => option.setName('user').setDescription('User to view').setRequired(false)),

  async execute(interaction) {
    const guildId = interaction.guild?.id;
    if (!guildId) {
      return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user') || interaction.user;
    const userId = targetUser.id;

    try {
      // ⚡ better-sqlite3 is synchronous, so no await needed
      const row = db.get(
        "SELECT xp, level FROM users WHERE user_id = ? AND guild_id = ?",
        [userId, guildId]
      );

      const xp = row ? Number(row.xp || 0) : 0;
      const level = row ? Number(row.level || 1) : 1;

      const levelStart = (level - 1) * 100;
      const levelEnd = level * 100;
      const progress = Math.max(0, Math.min(100, xp - levelStart));
      const toNext = Math.max(0, levelEnd - xp);

      let displayName = `<@${userId}>`;
      try {
        const member = await interaction.guild.members.fetch(userId).catch(() => null);
        if (member) displayName = member.displayName;
      } catch {
        // fallback
      }

      const embed = new EmbedBuilder()
        .setTitle(`📊 Rank • ${displayName}`)
        .addFields(
          { name: 'Level', value: `${level}`, inline: true },
          { name: 'Total XP', value: `${xp}`, inline: true },
          { name: 'Progress', value: `${progress} / 100 XP\n(${toNext} XP to next level)`, inline: false },
        )
        .setColor(0x00AEEF)
        .setTimestamp()
        .setFooter({ text: 'PingPal • Rank' });

      return interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error in /rank command:', err);
      return interaction.reply({ content: '⚠️ Could not fetch rank. Please try again later.', ephemeral: true });
    }
  },
};