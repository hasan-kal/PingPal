module.exports = {
  name: "help",
  description: "Lists all available commands",
  execute(message) {
    const commands = message.client.commands.map(
      cmd => `**!${cmd.name}** → ${cmd.description}`
    );

    message.reply({
      content: `📖 **PingPal Commands**\n\n${commands.join("\n")}`,
    });
  },
};