const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Remove mute from a member")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Select a user to unmute")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    if (!member) return interaction.reply({ content: "❌ User not found.", ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: "❌ I cannot unmute this user.", ephemeral: true });

    try {
      await member.timeout(null);

      const embed = new EmbedBuilder()
        .setTitle("🔊 User Unmuted")
        .setColor(0x00FFAA)
        .setDescription(`<@${member.id}> has been unmuted.`)
        .setFooter({ text: "PingPal • Moderation", iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      const logChannel = interaction.guild.channels.cache.find(ch =>
        ["logs", "mod-logs", "admin-logs"].includes(ch.name)
      );
      if (logChannel && logChannel.isTextBased()) logChannel.send({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "❌ Failed to unmute the user.", ephemeral: true });
    }
  },
};