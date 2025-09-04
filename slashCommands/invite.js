const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const perms = (
  PermissionFlagsBits.SendMessages |
  PermissionFlagsBits.EmbedLinks |
  PermissionFlagsBits.ReadMessageHistory |
  PermissionFlagsBits.UseExternalEmojis |
  PermissionFlagsBits.AttachFiles
).toString(); // use ManageRoles too if you need auto-role assignment

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the invite link to add PingPal to other servers"),

  async execute(interaction) {
    const clientId = interaction.client.application.id;
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${perms}&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setTitle("Invite PingPal")
      .setDescription(`[Click here to invite PingPal](${url})\nYou need **Manage Server** in the target server.`)
      .setColor(0x00FFCC);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};