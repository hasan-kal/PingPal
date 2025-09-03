async function ensureRoles(guild) {
  const levelRoles = [
    { name: "Level 1", color: "Blue" },
    { name: "Level 5", color: "Green" },
    { name: "Level 10", color: "Gold" },
    { name: "Level 15", color: "Orange" },
    { name: "Level 20", color: "Purple" },
    { name: "Level 25", color: "Aqua" },
    { name: "Level 30", color: "DarkGreen" },
    { name: "Level 35", color: "DarkBlue" },
    { name: "Level 40", color: "Red" },
    { name: "Level 45", color: "DarkPurple" },
    { name: "Level 50", color: "DarkGold" },
  ];

  for (const roleData of levelRoles) {
    let role = guild.roles.cache.find(r => r.name === roleData.name);
    if (!role) {
      try {
        role = await guild.roles.create({
          name: roleData.name,
          color: roleData.color,
          reason: "Leveling system setup",
        });
        console.log(`✅ Created role: ${roleData.name} in ${guild.name}`);
      } catch (err) {
        console.error(`❌ Could not create role ${roleData.name} in ${guild.name}:`, err);
      }
    }
  }
}

module.exports = { ensureRoles };
