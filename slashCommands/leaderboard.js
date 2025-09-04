const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the server leaderboard by XP"),
  async execute(interaction) {
    try {
      const itemsPerPage = 10;

      const guildMemberIDs = interaction.guild.members.cache.map(member => member.id);
      const allUsers = db
        .prepare(
          `SELECT * FROM users WHERE id IN (${guildMemberIDs.map(() => "?").join(",")}) ORDER BY xp DESC`
        )
        .all(...guildMemberIDs);

      if (!allUsers.length) {
        return interaction.reply("📊 No users in this server have XP yet.");
      }

      let page = 1;
      const totalPages = Math.ceil(allUsers.length / itemsPerPage);

      const generateEmbed = (currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageUsers = allUsers.slice(startIndex, startIndex + itemsPerPage);

        let description = "";
        for (let i = 0; i < pageUsers.length; i++) {
          const userData = pageUsers[i];
          const member = interaction.guild.members.cache.get(userData.id);
          const username = member ? member.user.username : "Unknown User";
          description += `**#${startIndex + i + 1}** 🏅 ${username} — Level ${userData.level} (${userData.xp} XP)\n`;
        }

        return new EmbedBuilder()
          .setColor(0x00AEEF)
          .setTitle(`🏆 ${interaction.guild.name} Leaderboard`)
          .setDescription(description)
          .setFooter({ text: `Page ${currentPage} of ${totalPages} • Keep chatting to climb the ranks!`, iconURL: interaction.client.user.avatarURL() })
          .setTimestamp();
      };

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages)
      );

      const message = await interaction.reply({ embeds: [generateEmbed(page)], components: [row], fetchReply: true });

      const collector = message.createMessageComponentCollector({ time: 60000 });

      collector.on('collect', i => {
        if (i.user.id !== interaction.user.id) {
          return i.reply({ content: "This is not for you!", ephemeral: true });
        }

        if (i.customId === 'next') page++;
        if (i.customId === 'prev') page--;

        i.update({ embeds: [generateEmbed(page)], components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('prev')
              .setLabel('Previous')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(page === 1),
            new ButtonBuilder()
              .setCustomId('next')
              .setLabel('Next')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(page === totalPages)
          )
        ]});
      });

    } catch (error) {
      console.error("Leaderboard command error:", error);
      await interaction.reply("❌ Could not fetch the leaderboard.");
    }
  },
};