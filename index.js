const { Client, GatewayIntentBits, Collection, EmbedBuilder, Partials } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const db = require("./database");
const express = require("express");

// Initialize client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// Collections
client.commands = new Collection();
client.slashCommands = new Collection();

// Load prefix commands (optional)
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name) client.commands.set(command.name, command);
}

// Load slash commands
const slashFiles = fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"));
for (const file of slashFiles) {
  const command = require(`./slashCommands/${file}`);
  if (command.data && command.execute) client.slashCommands.set(command.data.name, command);
}

// Handle interactions
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error in /${interaction.commandName}:`, error);

    // Reply to user only if interaction is not already acknowledged
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "⚠️ Something went wrong running that command.", ephemeral: true }).catch(() => {});
    }

    // Send error details to logs channel
    const logChannel = interaction.guild?.channels.cache.find(ch =>
      ["logs", "mod-logs", "admin-logs"].includes(ch.name)
    );

    if (logChannel && logChannel.isTextBased()) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Command Error")
        .setColor(0xff5555)
        .addFields(
          { name: "Command", value: `/${interaction.commandName}`, inline: true },
          { name: "User", value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
          { name: "Guild", value: interaction.guild?.name ?? "DM", inline: true }
        )
        .setDescription(`\`\`\`\n${String(error.stack || error).slice(0, 1900)}\n\`\`\``)
        .setTimestamp();

      logChannel.send({ embeds: [errorEmbed] }).catch(() => {});
    }
  }
});

// XP and level system
function addXP(userId, guildId, amount = 10, message) {
  const user = db.prepare("SELECT * FROM users WHERE user_id = ? AND guild_id = ?").get(userId, guildId);

  if (!user) {
    db.prepare("INSERT INTO users (user_id, guild_id, xp, level) VALUES (?, ?, ?, ?)").run(userId, guildId, amount, 1);
  } else {
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;

    if (newLevel > user.level && message) {
      const embed = new EmbedBuilder()
        .setColor(0xFFD700)
        .setTitle("🎉 Level Up!")
        .setDescription(`<@${userId}> has reached **Level ${newLevel}** in **${message.guild.name}**! Keep it up!`)
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp();

      message.channel.send({ embeds: [embed] }).catch(() => {});
    }

    db.prepare("UPDATE users SET xp = ?, level = ? WHERE user_id = ? AND guild_id = ?").run(newXP, newLevel, userId, guildId);
  }
}

// Listen for messages to give XP
client.on("messageCreate", (message) => {
  if (!message.author.bot && message.guild) {
    addXP(message.author.id, message.guild.id, 10, message);
  }
});

// Ready event
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.guilds.cache.forEach(async guild => {
    const existingLogChannel = guild.channels.cache.find(ch =>
      ["logs", "mod-logs", "admin-logs"].includes(ch.name)
    );

    if (!existingLogChannel) {
      try {
        await guild.channels.create({
          name: "logs",
          type: 0,
          permissionOverwrites: [
            { id: guild.roles.everyone.id, deny: ["SendMessages"] },
          ],
        });
        console.log(`📑 Logs channel created in ${guild.name}`);
      } catch (err) {
        console.warn(`⚠️ Could not create logs channel in ${guild.name}. Missing Permissions.`);
      }
    } else {
      console.log(`ℹ️ Using existing logs channel in ${guild.name}: #${existingLogChannel.name}`);
    }
  });
});

// Express server for uptime
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>PingPal Status</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background-color: #1e1e2f; color: #f5f5f5; text-align:center; margin-top:50px; }
          h1 { font-size:2.5rem; margin-bottom:20px; color:#00ffcc; }
          p { font-size:1.2rem; color:#dddddd; }
        </style>
      </head>
      <body>
        <h1>🤖 PingPal is running!</h1>
        <p>Your Discord bot is online and working fine 🚀</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`✅ Express server running on port ${PORT}`));

client.login(process.env.DISCORD_TOKEN);

// Catch unhandled errors
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);