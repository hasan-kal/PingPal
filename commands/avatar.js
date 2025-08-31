const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Displays a user's avatar",
  execute(message, args) {
    // Get the mentioned member or default to the author
    const member = message.mentions.members.first() || message.member;

    const embed = new EmbedBuilder()
      .setTitle(`${member.user.tag}'s Avatar`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setColor("Purple")
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};