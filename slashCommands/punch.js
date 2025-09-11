const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("punch")
    .setDescription("Punch someone (playfully)!")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("The user you want to punch")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const res = await fetch("https://nekos.best/api/v2/punch");
    const data = await res.json();

    const gif = data.results[0].url;

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`👊 ${interaction.user} punches ${target}!`)
      .setImage(gif);

    await interaction.reply({ embeds: [embed] });
  },
};