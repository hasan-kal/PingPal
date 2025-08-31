const logAction = require("../utils/logger");

module.exports = {
  name: "guildMemberUpdate",
  execute(oldMember, newMember) {
    const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

    addedRoles.forEach(role => {
      logAction(newMember.guild, `➕ ${newMember.user.tag} was given the **${role.name}** role.`);
    });

    removedRoles.forEach(role => {
      logAction(newMember.guild, `➖ ${newMember.user.tag} had the **${role.name}** role removed.`);
    });
  },
};