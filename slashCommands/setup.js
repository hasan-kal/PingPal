const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Check if PingPal has proper permissions and role position in this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only admins can run

  async execute(interaction) {
    const botMember = interaction.guild.members.me;

    const requiredPermissions = [
      PermissionFlagsBits.KickMembers,
      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ModerateMembers
    ];

    const missingPermissions = requiredPermissions.filter(perm => !botMember.permissions.has(perm));

    const botRolePosition = botMember.roles.highest.position;
    const criticalRoles = interaction.guild.roles.cache
      .filter(r => r.members.size > 0 && r.position >= botRolePosition);

    const embed = new EmbedBuilder()
      .setTitle("🛠️ PingPal Setup Check")
      .setColor(0x00AAFF)
      .setTimestamp()
      .setFooter({ text: "PingPal • Setup", iconURL: botMember.displayAvatarURL() });

    if (missingPermissions.length === 0 && criticalRoles.size === 0) {
      embed.setDescription("✅ PingPal has all required permissions and role position. Everything is good!");
    } else {
      let desc = "⚠️ Some setup issues found:\n";

      if (missingPermissions.length > 0) {
        desc += `\n**Missing Permissions:**\n${missingPermissions.map(p => `• ${p}`).join("\n")}`;
      }

      if (criticalRoles.size > 0) {
        desc += `\n**Roles above PingPal:**\n${criticalRoles.map(r => `• ${r.name}`).join("\n")}\nPingPal's role must be higher than these to manage members.`;
      }

      desc += "\n\nPlease adjust the bot’s role and permissions.";
      embed.setDescription(desc);
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};