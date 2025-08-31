const logAction = require("../utils/logger");

module.exports = {
  name: "unmute",
  description: "Unmute a member by removing the Muted role",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageRoles")) {
      return message.reply("❌ You don’t have permission to manage roles.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("⚠️ Please mention a user to unmute.");

    const mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");
    if (!mutedRole) {
      return message.reply("⚠️ No Muted role found in this server.");
    }

    if (!member.roles.cache.has(mutedRole.id)) {
      return message.reply("⚠️ This member is not muted.");
    }

    try {
      await member.roles.remove(mutedRole);
      message.reply(`🔊 ${member.user.tag} has been unmuted.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ I couldn’t unmute that member.");
    }
  },
};