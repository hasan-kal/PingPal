const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select a user to kick")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("Reason for kicking")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!target) return interaction.reply({ content: "❌ User not found.", ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: "❌ I cannot kick this user.", ephemeral: true });

    try {
      await target.kick(reason);

      const embed = new EmbedBuilder()
        .setColor(0xFF5555)
        .setTitle("👢 User Kicked")
        .setDescription(`<@${target.id}> has been kicked.`)
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
      return interaction.reply({ content: "❌ Failed to kick the user.", ephemeral: true });
    }
  },
};