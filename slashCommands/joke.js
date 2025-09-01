const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Get a random joke"),

  async execute(interaction) {
    try {
      const response = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
      await interaction.reply(`😂 ${response.data.joke}`);
    } catch (error) {
      console.error(error);
      await interaction.reply("❌ Could not fetch a joke right now.");
    }
  },
};