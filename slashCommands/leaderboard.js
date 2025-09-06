const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show server leaderboard (top users)"),

  async execute(interaction) {
    try {
      if (!interaction.guild) {
        return interaction.reply({ content: "❌ This command must be used in a server.", ephemeral: true });
      }

      const allUsers = db
        .prepare("SELECT user_id, xp, level FROM users WHERE guild_id = ? ORDER BY level DESC, xp DESC LIMIT 10")
        .all(interaction.guild.id);

      if (!allUsers || allUsers.length === 0) {
        return interaction.reply({ content: "📊 No users in this server have XP yet.", ephemeral: true });
      }

      const description = await Promise.all(allUsers.map(async (u, i) => {
        // try to fetch member; fallback to mention via id
        const member = interaction.guild.members.cache.get(u.user_id) || await interaction.guild.members.fetch(u.user_id).catch(()=>null);
        const name = member ? `${member.user.tag}` : `Unknown User (${u.user_id})`;
        return `**${i+1}.** ${name} — Level ${u.level} (${u.xp} XP)`;
      }));

      const embed = new EmbedBuilder()
        .setTitle("📊 Server Leaderboard")
        .setColor(0x00AEEF)
        .setDescription(description.join("\n"))
        .setFooter({ text: `PingPal • Top ${allUsers.length}`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("Error in /leaderboard:", err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "⚠️ Could not fetch the leaderboard. Please try again later.", ephemeral: true }).catch(()=>{});
      }
      const logChannel = interaction.guild?.channels.cache.find(ch =>
        ["logs", "mod-logs", "admin-logs"].includes(ch.name)
      );
      if (logChannel && logChannel.isTextBased()) {
        const errEmbed = new EmbedBuilder()
          .setTitle("Error: /leaderboard")
          .setColor(0xff5555)
          .setDescription(`\`\`\`\n${String(err.stack || err).slice(0, 1900)}\n\`\`\``)
          .addFields(
            { name: "Guild", value: `${interaction.guild?.name} (${interaction.guild?.id})`, inline: true },
            { name: "User", value: `${interaction.user.tag} (${interaction.user.id})`, inline: true }
          )
          .setTimestamp();
        logChannel.send({ embeds: [errEmbed] }).catch(() => {});
      }
    }
  },
};