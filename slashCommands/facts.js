// slashCommands/facts.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('facts')
    .setDescription('Get a random fun fact!'),

  async execute(interaction) {
    await interaction.deferReply(); // shows "thinking..." while fetching

    try {
      // Using some free random fact API
      const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
      const data = await response.json();

      if (!data || !data.text) {
        return interaction.editReply({ content: '❌ Could not fetch a fact, try again later.' });
      }

      const factEmbed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setTitle('📚 Random Fact')
        .setDescription(data.text)
        .setFooter({ text: 'Powered by uselessfacts.jsph.pl' })
        .setTimestamp();

      await interaction.editReply({ embeds: [factEmbed] });

    } catch (error) {
      console.error('Error fetching fact:', error);
      await interaction.editReply({ content: '❌ Failed to fetch a fact. Please try again later.' });
    }
  }
};