const logAction = require("../utils/logger");

module.exports = {
  name: "kick",
  description: "Kick a member from the server",
  async execute(message, args) {
    if (!message.member.permissions.has("KickMembers")) {
      return message.reply("❌ You don’t have permission to kick members.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("⚠️ Please mention a user to kick.");

    try {
      await member.kick();
      message.reply(`✅ ${member.user.tag} has been kicked.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ I couldn’t kick that member.");
    }
  },
};