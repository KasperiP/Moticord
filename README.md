<h1 align="center">
  <br>
  Moticord
</h1>

<h3 align=center>Multipurpose Discord-bot for one of the Finland's biggest Discord-servers, Puskaradio. Built with latest and greatest <a href=https://github.com/discordjs/discord.js>discord.js</a></h3>

<div align=center>

  <a href="https://discord.com/invite/Eggb2w7">
    <img src="https://discordapp.com/api/guilds/162669821312368640/widget.png?style=shield" alt="shield.png">
  </a>

  <a href="https://github.com/discordjs">
    <img src="https://img.shields.io/badge/discord.js-v13.5.0-blue.svg?logo=npm" alt="shield.png">
  </a>

  <a href="https://github.com/KasperiP/Moticord/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-GNU%20GPL%20v3-green" alt="shield.png">
  </a>

</div>

<p align="center">
  <a href="#about">About</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#setting-up">Setting Up</a>
  •
    <a href="#to-do">To-do</a>
  •
  <a href="#license">License</a>

## About

Moticord is an open source Discord-bot designed to meet the needs of one of Finland's largest Discord servers. It's codebase serves as a base framework to easily create Discord bots of all kinds. You can join the official [Puskaradio](https://discord.com/invite/Eggb2w7) and see Moticord in action. _Puhumme suomea_!

If you liked this repository, feel free to leave a star ⭐!

## Installation

You can clone this repo and host the bot yourself.

```
git clone https://github.com/KasperiP/Moticord.git
```

After cloning, run an

```
npm install
```

to snag all of the dependencies. Of course, you need [node](https://nodejs.org/en/) installed. I also strongly recommend [nodemon](https://www.npmjs.com/package/nodemon) as it makes testing _much_ easier.

## Setting Up

Rename`example-config.json` to `config.json`. Your file should look something like this:

```json
{
    "BOT_TOKEN": "BOT_TOKEN",
    "MONGODB_URI": "MONGODB_URI",
    "CLIENT_ID": "CLIENT_ID",
    "GUILD_ID": "GUILD_ID",
    "STAFF_ROLES": ["STAFF_ROLE_ID"],
    "ROLE_CHANNEL": "ROLE_CHANNEL_ID",
    "COLORS": {
        "SUCCESS": "#55FF55",
        "ERROR": "#FF5555",
        "WARNING": "#FFFF55"
    },
    "BAN_ROLE": "BAN_ROLE",
    "BAN_CHANNEL": "BAN_CHANNEL",
    "MUTE_ROLE": "MUTE_ROLE",
    "TICKET_CHANNEL": "TICKET_CHANNEL_ID",
    "TICKET_CATEGORY": "TICKET_CATEGORY_ID",
    "WARN_EXPIRES": 30,
    "WARN_THRESHOLD": 4,
    "WARN_BAN_DAYS": 30,
    "DELETE_INVITES": true,
    "SPAN_HANDLER": false
}
```

Visit the Discord [developer portal](https://discordapp.com/developers/applications/) to create an app and use the client token you are given for the `BOT_TOKEN` option. `GUILD_ID` is your server's ID.

After your `config.json` file is built, you have to enable `Privileged Intents` on your Discord [developer portal](https://discordapp.com/developers/applications/). You can find these intents under the "Bot" section, and there are two ticks you have to switch on.

Once done, launch the bot using the command `node bot.js` or `nodemon bot.js`. If on Linux, you can also kick off using the `start.sh` script.

## To-Do

Moticord is in a continuous state of development. New features/updates may come at any time. Some pending ideas are:

-   Nothing atm? Ideas?

## License

Released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.
