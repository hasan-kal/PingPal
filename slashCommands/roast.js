const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const ROASTS = [
  "You're like a cloud—when you disappear, it's a beautiful day.",
  "You're proof that evolution can go in reverse.",
  "You bring people so much joy… when you leave the room.",
  "You're like a software update—every time I see you, I ask 'Do I really need this?'",
  "You're the reason they put directions on shampoo bottles.",
  "You're like a speed bump—nobody likes you, but we just deal with you.",
  "You're like Monday morning—absolutely nobody looks forward to you.",
  "You're like a cloudy day—slightly disappointing but still there.",
  "You're like decaf coffee—pointless but trying.",
  "You're the human version of a participation award.",
  "You're like a TV remote—everyone loses you when they need you most.",
  "You bring chaos in the cutest possible way.",
  "You're like a puzzle missing a piece—confusing but kinda fun.",
  "You're like that one sock that always disappears in the laundry.",
  "You're proof that life has a sense of humor.",
  "You're like a sneeze in a quiet room—unexpected and a little annoying.",
  "You're like a fridge light—nobody notices you until you disappear.",
  "You're like a traffic cone—always in the way but someone has to deal with you.",
  "You're like a WiFi signal in a tunnel—weak but persistent.",
  "You're like cereal without milk—dry, but still kind of fun.",
  "You're like a candle in the wind—bright for a moment, then gone.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Roast someone (light-hearted!)")
    .addUserOption(opt => opt.setName("user").setDescription("Who should we roast?")),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const target = interaction.options.getUser("user") ?? interaction.user;
      const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
      const embed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setDescription(`🔥 ${target} ${roast}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`❌ /roast error:`, error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: "⚠️ Something went wrong while roasting.", ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content: "⚠️ Something went wrong while roasting.", ephemeral: true }).catch(() => {});
      }
    }
  },
};