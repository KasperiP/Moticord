const Discord = require('discord.js');
const Bans = require('../models/banModel');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @description Called when a member joins the guild.
     * @param {Discord.Client} client
     * @param {Discord.GuildMember} guildMember
     */
    async execute(client, guildMember) {
        const { user } = guildMember;

        // Check if user is banned on join, if so, give ban role back.
        const isBanned = await Bans.findOne({ userId: user.id, active: true });
        if (isBanned) {
            // Update user's ban.
            await Bans.findOneAndUpdate(
                { userId: user.id },
                {
                    $set: {
                        userId: user.id,
                        username: user.username,
                        userDiscriminator: user.discriminator,
                    },
                },
            );

            guildMember.roles.add(process.env.BAN_ROLE);
        }
    },
};
