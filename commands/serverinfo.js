const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Displays information about the server",
  execute(message, args) {
    const { guild } = message;

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Server Info`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "Server Name", value: guild.name, inline: true },
        { name: "Server ID", value: guild.id, inline: true },
        { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
        { name: "Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: false },
        { name: "Boost Tier", value: `${guild.premiumTier}`, inline: true },
        { name: "Boost Count", value: `${guild.premiumSubscriptionCount}`, inline: true }
      )
      .setColor("Green")
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};