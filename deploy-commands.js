const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

const commands = [];
const commandFiles = fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./slashCommands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("🚀 Refreshing slash commands...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Slash commands registered globally!");
  } catch (error) {
    console.error(error);
  }
})();