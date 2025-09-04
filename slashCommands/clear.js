const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete messages in bulk")
    .addIntegerOption(option =>
      option.setName("amount")
        .setDescription("Number of messages to delete (max 100)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    if (amount < 1 || amount > 100) return interaction.reply({ content: "❌ You can delete 1–100 messages at a time.", ephemeral: true });

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setTitle("🧹 Messages Cleared")
        .setColor(0x00AAFF)
        .setDescription(`Deleted **${deleted.size}** messages.`)
        .setFooter({ text: "PingPal • Moderation", iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

      const logChannel = interaction.guild.channels.cache.find(ch =>
        ["logs", "mod-logs", "admin-logs"].includes(ch.name)
      );
      if (logChannel && logChannel.isTextBased()) logChannel.send({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "❌ Failed to delete messages.", ephemeral: true });
    }
  },
};