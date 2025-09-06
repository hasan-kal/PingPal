const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check your level and XP progress.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Check rank of another user")
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      if (!interaction.guild) {
        return interaction.reply({ content: "❌ This command must be used in a server.", ephemeral: true });
      }

      const target = interaction.options.getUser("user") || interaction.user;

      const user = db
        .prepare("SELECT * FROM users WHERE user_id = ? AND guild_id = ?")
        .get(target.id, interaction.guild.id);

      if (!user) {
        return interaction.reply({ content: `❌ ${target.username} has no XP yet in this server.`, ephemeral: true });
      }

      const xpForNext = user.level * 100; // 100 XP per level (adjust if you used a different formula)
      const embed = new EmbedBuilder()
        .setColor(0xFFD700)
        .setTitle(`📊 Rank of ${target.username}`)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "🎯 Level", value: `${user.level}`, inline: true },
          { name: "💬 XP", value: `${user.xp} / ${xpForNext}`, inline: true }
        )
        .setFooter({ text: "PingPal • Keep chatting to gain XP!", iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("Error in /rank:", err);
      // notify admin logs channel but do not fail the interaction twice
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "⚠️ Something went wrong running that command.", ephemeral: true }).catch(() => {});
      }
      const logChannel = interaction.guild?.channels.cache.find(ch =>
        ["logs", "mod-logs", "admin-logs"].includes(ch.name)
      );
      if (logChannel && logChannel.isTextBased()) {
        const errEmbed = new EmbedBuilder()
          .setTitle("Error: /rank")
          .setColor(0xff5555)
          .setDescription(`\`\`\`\n${String(err.stack || err).slice(0, 1900)}\n\`\`\``)
          .addFields(
            { name: "Guild", value: `${interaction.guild?.name} (${interaction.guild?.id})`, inline: true },
            { name: "User", value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
            { name: "Target", value: `${target.tag ?? target.username} (${target.id})`, inline: true }
          )
          .setTimestamp();
        logChannel.send({ embeds: [errEmbed] }).catch(() => {});
      }
    }
  }
};