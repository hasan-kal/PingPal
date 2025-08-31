const axios = require("axios");

module.exports = {
  name: "meme",
  description: "Fetches a random meme from r/memes",
  async execute(message) {
    try {
      const response = await axios.get("https://www.reddit.com/r/memes/random/.json?limit=1");
      const memeData = response.data[0].data.children[0].data;

      const title = memeData.title;
      const image = memeData.url;

      message.channel.send({ content: `📸 **${title}**\n${image}` });
    } catch (error) {
      console.error(error);
      message.channel.send("❌ Could not fetch a meme right now. Try again later.");
    }
  },
};