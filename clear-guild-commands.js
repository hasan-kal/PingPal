const { REST, Routes } = require("discord.js");
require("dotenv").config();

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    const data = await rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID));
    for (const command of data) {
      await rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, command.id));
      console.log(`Deleted guild command ${command.name}`);
    }
    console.log("✅ All guild commands cleared!");
  } catch (error) {
    console.error(error);
  }
})();