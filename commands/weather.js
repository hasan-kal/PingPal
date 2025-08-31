const axios = require("axios");

module.exports = {
  name: "weather",
  description: "Shows the current weather for a city",
  async execute(message, args) {
    if (!args[0]) return message.reply("⚠️ Please provide a city name. Example: `!weather London`");

    const city = args.join(" ");
    const apiKey = process.env.OPENWEATHER_API_KEY;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      const data = response.data;

      const weatherMsg = `🌤️ **Weather in ${data.name}**:
- Temperature: ${data.main.temp}°C
- Feels like: ${data.main.feels_like}°C
- Weather: ${data.weather[0].description}
- Humidity: ${data.main.humidity}%
- Wind speed: ${data.wind.speed} m/s`;

      message.channel.send(weatherMsg);
    } catch (error) {
      console.error(error);
      message.channel.send("❌ Could not fetch weather. Make sure the city name is correct.");
    }
  },
};