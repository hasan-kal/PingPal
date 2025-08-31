const logAction = require("../utils/logger");

module.exports = {
  name: "mute",
  description: "Mute a member by assigning them a Muted role",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageRoles")) {
      return message.reply("❌ You don’t have permission to manage roles.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("⚠️ Please mention a user to mute.");

    // Find or create Muted role
    let mutedRole = message.guild.roles.cache.find(r => r.name === "Muted");
    if (!mutedRole) {
      try {
        mutedRole = await message.guild.roles.create({
          name: "Muted",
          color: "#555555",
          permissions: [],
        });

        // Prevent sending messages in all channels
        message.guild.channels.cache.forEach(channel => {
          channel.permissionOverwrites.create(mutedRole, {
            SendMessages: false,
            Speak: false,
            AddReactions: false,
          });
        });

      } catch (error) {
        console.error(error);
        return message.reply("❌ I couldn’t create a Muted role.");
      }
    }

    // Assign Muted role
    if (member.roles.cache.has(mutedRole.id)) {
      return message.reply("⚠️ This member is already muted.");
    }

    try {
      await member.roles.add(mutedRole);
      message.reply(`🔇 ${member.user.tag} has been muted.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ I couldn’t mute that member.");
    }
  },
};