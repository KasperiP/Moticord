import { Client, Collection, Intents } from "discord.js";
import { readdirSync } from "fs";
import { config } from "./config";

export type ClientType = {};

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
});

// Load events
const eventFiles = readdirSync("./src/events").filter((file) =>
  file.endsWith(".js")
);
for (const file of eventFiles) {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

// Load commands
client.commands = new Collection();
const commandFiles = readdirSync("./src/commands").filter((file) =>
  file.endsWith(".js")
);
for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Initialize client
client.login(config.BOT_TOKEN);
