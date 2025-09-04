const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const ROASTS = [
  "I’d explain it to you, but I left my crayons at home.",
  "Your code has more bugs than a summer camp cabin.",
  "If confidence were RAM, you’d be a calculator watch.",
  "You debug like you’re playing whack-a-mole… blindfolded.",
  "Your WiFi is faster than your comebacks.",
  "You’re the reason the README has screenshots.",
  "Your repo history is just ‘fix typo’ and lies.",
  "Even ChatGPT asked for a break after reading your code.",
  "You're proof that even copy-paste can go wrong.",
  "I’ve seen cleaner code in spaghetti factories.",
  "Your debugging strategy is just adding console.log everywhere.",
  "You're like a semicolon in Python—completely unnecessary.",
  "If procrastination was a skill, you'd be senior developer by now.",
  "Your pull requests should come with a trigger warning.",
  "Even your shadow avoids following your logic.",
  "You're the human version of a 404 error.",
  "Your brain has more cache misses than a broken CPU.",
  "I've seen AI write better comments than you.",
  "You're like a cloud—when you disappear, it's a beautiful day.",
  "You're proof that evolution can go in reverse.",
  "You bring people so much joy… when you leave the room.",
  "You're like a software update—whenever I see you, I think 'Do I really need this?'",
  "You're the reason they put directions on shampoo bottles.",
  "You're like a cloud storage plan—full of space, but not very useful.",
  "You're like a speed bump—nobody likes you, but we just deal with you.",
  "You're like a math problem—nobody wants to solve you.",
  "You're like WiFi at a concert—always there but never working.",
  "You're like Monday morning—absolutely nobody looks forward to you.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Roast someone (light-hearted!)")
    .addUserOption(opt => opt.setName("user").setDescription("Who should we roast?")),

  async execute(interaction) {
    const target = interaction.options.getUser("user") ?? interaction.user;
    const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
    const embed = new EmbedBuilder()
      .setColor(0xFF6B6B)
      .setDescription(`🔥 ${target} ${roast}`);

    await interaction.reply({ embeds: [embed] });
  },
};