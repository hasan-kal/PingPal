const logAction = require("../utils/logger");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    logAction(member.guild, `✅ **${member.user.tag}** joined the server.`);
  },
};