const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Displays information about a user",
  execute(message, args) {
    // Get the mentioned member or default to the author
    const member = message.mentions.members.first() || message.member;

    const embed = new EmbedBuilder()
      .setTitle(`${member.user.tag}'s Info`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "Username", value: member.user.username, inline: true },
        { name: "ID", value: member.id, inline: true },
        { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: false },
        { name: "Roles", value: member.roles.cache.map(r => r.name).filter(r => r !== "@everyone").join(", ") || "None", inline: false }
      )
      .setColor("Blue")
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};