const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Load events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.guilds.cache.forEach(guild => {
    if (!guild.channels.cache.find(ch => ch.name === "logs")) {
      guild.channels.create({
        name: "logs",
        type: 0, // 0 = text channel
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: ["SendMessages"],
          },
        ],
      }).then(channel => console.log(`📑 Logs channel created in ${guild.name}`));
    }
  });
});

client.login(process.env.DISCORD_TOKEN);