export const config = {
  database: {
    uri: process.env.MONGODB_URI,
    ssl: process.env.MONGODB_SSL,
    debug: process.env.MONGODB_DEBUG,
  },
  discord: {
    client_id: process.env.DISCORD_CLIENT_ID,
    bot: { token: process.env.DISCORD_BOT_TOKEN },
  },
};
