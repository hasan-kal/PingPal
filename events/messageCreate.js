const prefix = "!"; // You can change this later

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Load commands dynamically
    const command = message.client.commands.get(commandName);
    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("❌ Oops! There was an error running that command.");
    }
  },
};