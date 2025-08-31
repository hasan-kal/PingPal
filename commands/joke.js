const axios = require("axios");

module.exports = {
  name: "joke",
  description: "Sends a random joke",
  async execute(message) {
    try {
      const response = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
      const joke = response.data.joke;

      message.channel.send(`😂 ${joke}`);
    } catch (error) {
      console.error(error);
      message.channel.send("❌ Could not fetch a joke right now. Try again later.");
    }
  },
};