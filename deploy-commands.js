const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

const commands = [];
const commandFiles = fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  try {
    const command = require(`./slashCommands/${file}`);
    if (!command.data) {
      console.warn(`${file} is missing 'data' property!`);
      continue;
    }
    commands.push(command.data.toJSON());
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
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