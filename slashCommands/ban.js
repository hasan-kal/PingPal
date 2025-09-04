const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select a user to ban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("Reason for banning")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!target) return interaction.reply({ content: "❌ User not found.", ephemeral: true });
    if (!target.bannable) return interaction.reply({ content: "❌ I cannot ban this user.", ephemeral: true });

    try {
      await target.ban({ reason });

      const embed = new EmbedBuilder()
        .setColor(0xFF5555)
        .setTitle("🔨 User Banned")
        .setDescription(`<@${target.id}> has been banned.`)
        .addFields(
          { name: "Reason", value: reason },
          { name: "By", value: `<@${interaction.user.id}>`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: "PingPal • Moderation", iconURL: interaction.client.user.displayAvatarURL() });

      await interaction.reply({ embeds: [embed] });

      // Logging to logs channel
      const logChannel = interaction.guild.channels.cache.find(ch =>
        ["logs", "mod-logs", "admin-logs"].includes(ch.name)
      );
      if (logChannel && logChannel.isTextBased()) logChannel.send({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "❌ Failed to ban the user.", ephemeral: true });
    }
  },
};