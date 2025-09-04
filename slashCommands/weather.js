const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get current weather for a city")
    .addStringOption(opt =>
      opt.setName("city").setDescription("City name (e.g., London)").setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const city = interaction.options.getString("city");
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        return interaction.editReply({ content: "OpenWeather API key not configured.", ephemeral: true });
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const w = data.weather?.[0];
      const main = data.main || {};
      const wind = data.wind || {};

      const embed = new EmbedBuilder()
        .setTitle(`Weather in ${data.name}${data.sys?.country ? `, ${data.sys.country}` : ""}`)
        .setDescription(w?.description ? w.description[0].toUpperCase() + w.description.slice(1) : "—")
        .setThumbnail(w ? `https://openweathermap.org/img/wn/${w.icon}@2x.png` : null)
        .addFields(
          { name: "🌡 Temp", value: `${main.temp ?? "?"}°C (feels ${main.feels_like ?? "?"}°C)`, inline: true },
          { name: "💧 Humidity", value: `${main.humidity ?? "?"}%`, inline: true },
          { name: "💨 Wind", value: `${wind.speed ?? "?"} m/s`, inline: true },
        )
        .setColor(0x00AEEF)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`❌ /weather error:`, error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: "⚠️ Could not fetch weather. Please try again.", ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content: "⚠️ Could not fetch weather. Please try again.", ephemeral: true }).catch(() => {});
      }
    }
  },
};