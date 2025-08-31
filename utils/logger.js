// utils/logger.js
module.exports = function logAction(guild, actionMessage) {
  const logChannel = guild.channels.cache.find(ch => ch.name === "logs");
  if (!logChannel) return; // If no logs channel exists, do nothing
  logChannel.send(actionMessage);
};