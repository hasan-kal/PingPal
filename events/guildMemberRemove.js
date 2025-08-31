const logAction = require("../utils/logger");

module.exports = {
  name: "guildMemberRemove",
  execute(member) {
    logAction(member.guild, `❌ **${member.user.tag}** left the server.`);
  },
};