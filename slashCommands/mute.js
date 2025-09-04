const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a member temporarily")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select a user to mute")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("duration")
        .setDescription("Mute duration (e.g., 10m, 1h)")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const duration = interaction.options.getString("duration") || null;

    if (!member) return interaction.reply({ content: "❌ User not found.", ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: "❌ I cannot mute this user.", ephemeral: true });

    try {
      const timeMs = duration ? parseDuration(duration) : null; // function to convert "10m" to ms
      await member.timeout(timeMs);

      const embed = new EmbedBuilder()
        .setTitle("🔇 User Muted")
        .setColor(0xFFAA00)
        .setDescription(`<@${member.id}> has been muted${duration ? ` for ${duration}` : ""}.`)
        .setFooter({ text: "PingPal • Moderation", iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      // Logs
      const logChannel = interaction.guild.channels.cache.find(ch =>
        ["logs", "mod-logs", "admin-logs"].includes(ch.name)
      );
      if (logChannel && logChannel.isTextBased()) logChannel.send({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "❌ Failed to mute the user.", ephemeral: true });
    }
  },
};

// Helper function to convert duration string to ms
function parseDuration(str) {
  const match = str.match(/(\d+)([smhd])/);
  if (!match) return null;
  const num = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s": return num * 1000;
    case "m": return num * 60 * 1000;
    case "h": return num * 60 * 60 * 1000;
    case "d": return num * 24 * 60 * 60 * 1000;
    default: return null;
  }
}