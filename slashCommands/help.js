const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("📖 Shows a list of available commands"),
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x00AEEF)
      .setTitle("🤖 PingPal Help Menu ☕🍪")
      .setDescription("Grab a coffee and check out the commands you can use with PingPal:")

      // Category: Fun & Animals
      .addFields(
        { name: "🖼 Fun & Animals", value: "`/hug`, `/wave`, `/pat`, `/punch`, `/kiss`, `/cat`, `/dog`, `/fox`", inline: false },
        
        // Category: Filters & Memes
        { name: "🎨 Filters & Memes", value: "`/blur`, `/invert`, `/bw`, `/pixelate`, `/magik`, `/wide`, `/snow`", inline: false },
        
        // Category: Utility / Core
        { name: "⚡ Utility", value: "`/rank`, `/leaderboard`, `/xp`, `/roll`, `/say`, `/joke`, `/weather`, `/roast`, `/ping`, `/userinfo`, `/serverinfo`, `/avatar`, `/invite`, `/setup`", inline: false }
      )
      .setFooter({ text: "PingPal • Enjoy your refreshments! 🍩☕", iconURL: interaction.client.user.avatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};