const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Give someone a kiss 💋")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("The user you want to kiss")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const res = await fetch("https://nekos.best/api/v2/kiss");
    const data = await res.json();

    const gif = data.results[0].url;

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setDescription(`💋 ${interaction.user} kisses ${target}!`)
      .setImage(gif);

    await interaction.reply({ embeds: [embed] });
  },
};