// slashCommands/afk.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database.js'); // we'll use a simple table for AFK statuses

// Make sure your database has an afk table:
// CREATE TABLE IF NOT EXISTS afk (user_id TEXT NOT NULL, guild_id TEXT NOT NULL, reason TEXT, since TEXT, PRIMARY KEY(user_id, guild_id));

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

    // Insert or update AFK status in DB
    db.run(`
      INSERT INTO afk (user_id, guild_id, reason, since)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, guild_id)
      DO UPDATE SET reason = ?, since = ?;
    `, [interaction.user.id, interaction.guild.id, reason, now, reason, now]);

    // ✅ Change nickname to include [AFK]
    try {
      let member = interaction.member;
      if (member && member.manageable) {
        let oldNick = member.nickname || member.user.username;
        if (!oldNick.startsWith("[AFK]")) {
          await member.setNickname(`[AFK] ${oldNick}`);
        }
      }
    } catch (err) {
      console.error("Failed to update nickname for AFK:", err.message);
    }

    const embed = new EmbedBuilder()
      .setTitle('💤 AFK Enabled')
      .setDescription(`✅ <@${interaction.user.id}> is now AFK: **${reason}**`)
      .setColor(0x00AEEF)
      .setFooter({ text: 'PingPal • 2025', iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    // 🔹 Make this public so everyone sees it
    await interaction.reply({ embeds: [embed] });
  }
};