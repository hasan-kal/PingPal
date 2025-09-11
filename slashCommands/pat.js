const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pat")
    .setDescription("Pat someone on the head!")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("The user you want to pat")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const res = await fetch("https://nekos.best/api/v2/pat");
    const data = await res.json();

    const gif = data.results[0].url;

    const embed = new EmbedBuilder()
      .setColor(0xffcc99)
      .setDescription(`🖐️ ${interaction.user} pats ${target}!`)
      .setImage(gif);

    await interaction.reply({ embeds: [embed] });
  },
};