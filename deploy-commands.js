const { REST, Routes } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];

// Load commands dynamically, but skip AFK
const commandFiles = fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  if (file.toLowerCase() === "afk.js") continue; // ✅ Skip AFK command
  const command = require(`./slashCommands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("⏳ Refreshing application (/) commands...");

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log("✅ Successfully reloaded application (/) commands.");
    console.log(`🗑️ AFK command removed from Discord.`);
  } catch (error) {
    console.error("❌ Error reloading commands:", error);
  }
})();