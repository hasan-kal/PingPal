const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require("discord.js");
const fs = require("fs");

require("dotenv").config();
const db = require("./database");

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

// Load slash commands
client.slashCommands = new Collection();
const slashFiles = fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"));

for (const file of slashFiles) {
  const command = require(`./slashCommands/${file}`);
  client.slashCommands.set(command.data.name, command);
}

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error in /${interaction.commandName}:`, error);

    const safeMsg = "⚠️ Oops, something went wrong running that command.";
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: safeMsg, ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: safeMsg, ephemeral: true }).catch(() => {});
    }

    // Send details to logs channel for admins
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

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.guilds.cache.forEach(async guild => {
    // Try to find an existing logs channel
    const existingLogChannel = guild.channels.cache.find(ch =>
      ["logs", "mod-logs", "admin-logs"].includes(ch.name)
    );

    if (!existingLogChannel) {
      try {
        await guild.channels.create({
          name: "logs",
          type: 0, // text channel
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: ["SendMessages"],
            },
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

// Define role rewards mapping
const levelRoles = {
  1: "Level 1",
  5: "Level 5",
  10: "Level 10",
  15: "Level 15",
  20: "Level 20",
  25: "Level 25",
  30: "Level 30",
  35: "Level 35",
  40: "Level 40",
  45: "Level 45",
  50: "Level 50",
};

// Function to assign roles on level up
function handleRoleRewards(member, level) {
  const roleName = levelRoles[level];
  if (!roleName) return;

  const role = member.guild.roles.cache.find(r => r.name === roleName);
  if (role && !member.roles.cache.has(role.id)) {
    member.roles.add(role)
      .then(() => member.send(`✨ You've been given the **${roleName}** role!`))
      .catch(console.error);
  }
}

// Add XP system with level-up notifications and role rewards
function addXP(userId, amount = 10, message) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

  if (!user) {
    db.prepare("INSERT INTO users (id, xp, level) VALUES (?, ?, ?)").run(userId, amount, 1);
  } else {
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level

    if (newLevel > user.level && message) {
      const roleName = levelRoles[newLevel] || null;

      const embed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setTitle("🎉 Level Up!")
        .setDescription(`<@${userId}> has reached **Level ${newLevel}**! Keep it up!`)
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp();

      if (roleName) {
        embed.addFields({ name: "🏅 New Role", value: `You earned **${roleName}**!` });
      }

      message.channel.send({ embeds: [embed] });

      if (message.member) handleRoleRewards(message.member, newLevel);
    }

    db.prepare("UPDATE users SET xp = ?, level = ? WHERE id = ?").run(newXP, newLevel, userId);
  }
}

// Event listener to give XP on each message
client.on("messageCreate", (message) => {
  if (!message.author.bot) {
    addXP(message.author.id, 10, message);
  }
});

// Tiny Express server to keep bot alive
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>PingPal Status</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #1e1e2f;
            color: #f5f5f5;
            text-align: center;
            margin-top: 50px;
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: #00ffcc;
          }
          p {
            font-size: 1.2rem;
            color: #dddddd;
          }
        </style>
      </head>
      <body>
        <h1>🤖 PingPal is running!</h1>
        <p>Your Discord bot is online and working fine 🚀</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Express server running on port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);