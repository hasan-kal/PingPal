const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Get a random joke"),

  async execute(interaction) {
    try {
      const response = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
      
      const embed = new EmbedBuilder()
        .setTitle("😂 Here's a joke for you!")
        .setDescription(response.data.joke)
        .setColor(0x00AEEF)
        .setFooter({ text: "PingPal • 2025", iconURL: interaction.client.user.avatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "❌ Could not fetch a joke right now.", ephemeral: true });
    }
  },
};