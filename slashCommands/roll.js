const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice with N sides")
    .addIntegerOption(option =>
      option.setName("sides")
            .setDescription("Number of sides on the dice")
            .setRequired(true)
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides");
    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("🎲 Dice Roll")
      .setDescription(`You rolled a **${result}** (1-${sides})`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};