// slashCommands/afk.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js'); // SQLite helper

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for being AFK')
        .setRequired(false)
    ),

  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'AFK';
    const now = new Date().toISOString();

    try {
      // Insert or update AFK status in DB
      db.run(`
        INSERT INTO afk (user_id, guild_id, reason, since)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id, guild_id)
        DO UPDATE SET reason = ?, since = ?;
      `, [interaction.user.id, interaction.guild.id, reason, now, reason, now]);

      console.log(`✅ ${interaction.user.tag} is now AFK: ${reason}`);

      // Add [AFK] to nickname
      let member = interaction.member;
      if (member && member.manageable) {
        let oldNick = member.nickname || member.user.username;
        if (!oldNick.startsWith("[AFK]")) {
          await member.setNickname(`[AFK] ${oldNick}`);
        }
      }

      // Public embed for AFK status
      const embed = new EmbedBuilder()
        .setTitle('💤 AFK Enabled')
        .setDescription(`✅ <@${interaction.user.id}> is now AFK: **${reason}**`)
        .setColor(0x00AEEF)
        .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error setting AFK:', err);
      await interaction.reply({ content: '⚠️ Could not set AFK. Please try again later.', ephemeral: true });
    }
  }
};