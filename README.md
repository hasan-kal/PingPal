# 🤖 PingPal

PingPal is a full-fledged Discord utility bot built with **Node.js** and **discord.js**.  
It provides fun, utility, and server management features — including leveling, leaderboards, moderation, and more.

---

## ✨ Features
- 🎉 Fun commands (`/joke`, `/roll`, `/say`)
- 📊 Leveling system with XP, roles, and `/rank`
- 🏆 Leaderboards with pagination
- 🛠️ Utility commands (`/profile`, `/userinfo`, `/serverinfo`)
- 📰 Reddit + Weather API integrations
- 🔐 Role rewards up to Level 50
- 🌐 Status webpage deployed on Render

---

## 🛠️ Tech Stack
- [Node.js](https://nodejs.org/)
- [discord.js](https://discord.js.org/)
- [SQLite](https://www.sqlite.org/)
- [Express](https://expressjs.com/) (for status page)
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

3. Create a `.env` file and add your credentials:
   ```
   DISCORD_TOKEN=your-bot-token
   CLIENT_ID=your-client-id
   GUILD_ID=your-test-guild-id (optional)
   ```

4. Start the bot:
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
- `/profile` → Shows your XP and join date
- `/leaderboard` → Shows top 10 users with pagination
- `/serverinfo` → Server stats
- `/userinfo <@user>` → Info about a member

---

## 🌐 Deployment
PingPal is deployed on **Render** with a free web service.  
To keep it alive, an Express status page (`/`) is used and pinged by UptimeRobot.

---

## 📜 License
MIT License © 2025 Hasan
