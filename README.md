# 🤖 PingPal

PingPal is a full-fledged Discord utility bot built with **Node.js** and **discord.js**.  
It provides fun, utility, and server management features — including leveling, leaderboards, moderation, and more.  

---

## ✨ Features

### Fun Commands
- `/joke` → Get a random joke
- `/roll` → Roll a dice (default 6 sides)
- `/say <message>` → Bot repeats your message
- `/roast <@user>` → Roast a member (fun, non-technical)

### Utility Commands
- `/userinfo <@user>` → Show member information
- `/serverinfo` → Show server information
- `/avatar <@user>` → Display user avatar
- `/weather <city>` → Get current weather info
- `/setup` → Check bot permissions and role hierarchy in the server

### Moderation Commands
- `/kick <@user> [reason]` → Kick a member
- `/ban <@user> [reason]` → Ban a member
- `/mute <@user> [duration]` → Temporarily mute a member
- `/unmute <@user>` → Unmute a member
- `/clear <amount>` → Bulk delete messages

### Leveling & XP
- Earn XP by chatting
- Level up with `/rank`
- Leaderboards available with `/leaderboard`
- Level-up notifications with embeds

### Integrations
- Reddit and Weather APIs
- Express status page for uptime monitoring

---

## 🛠️ Tech Stack
- [Node.js](https://nodejs.org/)
- [discord.js](https://discord.js.org/)
- [SQLite](https://www.sqlite.org/)
- [Express](https://expressjs.com/) (for uptime/status page)
- [Render](https://render.com/) (deployment)

---

## 🚀 Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/hasan-kal/PingPal.git
   cd PingPal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   DISCORD_TOKEN=your-bot-token
   CLIENT_ID=your-client-id
   GUILD_ID=your-test-guild-id (optional for testing)
   ```

4. Deploy slash commands:
   ```bash
   node deploy-commands.js
   ```

5. Start the bot:
   ```bash
   npm start
   ```

---

## 💻 Usage
Invite PingPal to your server and try out commands like:

- `/ping` → Pong!
- `/joke` → Random joke
- `/roll` → Dice roll
- `/say <message>` → Bot repeats your message
- `/roast <@user>` → Fun roast a member
- `/userinfo <@user>` → Member info
- `/serverinfo` → Server stats
- `/avatar <@user>` → User avatar
- `/weather <city>` → Current weather
- `/rank` → Your level and XP
- `/leaderboard` → Top 10 users with pagination
- `/setup` → Check bot permissions and role hierarchy
- `/kick`, `/ban`, `/mute`, `/unmute`, `/clear` → Moderation commands

---

## 🌐 Deployment
- PingPal is deployed on **Render** with a free web service.  
- Express server at `/` keeps the bot alive.  
- Uptime is monitored with services like **UptimeRobot**.

---

## 📜 License
MIT License © 2025 Hasan

## 📄 Legal
- [Terms of Service](./TERMS_OF_SERVICE.md)
- [Privacy Policy](./PRIVACY_POLICY.md)
