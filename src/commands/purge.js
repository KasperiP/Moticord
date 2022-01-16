const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client, CommandInteraction, GuildMember } = require('discord.js');

/**
 * @description Kinda experimental feature. Probably has some bugs & is poorly tested.
 * @param {Interaction} interaction
 * @param {GuildMember} member
 * @param {string} days
 * @returns {void}
 */
const purgeMessages = async (interaction, member, days) => {
    const channels = Array.from((await interaction.guild.channels.fetch()).values()).filter(
        c => c.type === 'GUILD_TEXT',
    );

    let deleted = 0;
    const deleteCount = new Promise(resolve => {
        channels.forEach(async (channel, index) => {
            await channel.messages.fetch({ limit: 100 }).then(async messages => {
                const messagesToDelete = [];
                const date = new Date();
                date.setDate(date.getDate() - days);

                await messages
                    .filter(m => m.author.id === member.id)
                    .forEach(m => {
                        // Delete all messages that are older than the given amount of days

                        const messageDate = new Date(m.createdAt);

                        if (messageDate > date) {
                            if (!m.deletable) return;
                            messagesToDelete.push(m.id);
                        }
                    });

                if (messagesToDelete.length > 0) {
                    deleted += messagesToDelete.length;
                    await channel.bulkDelete(messagesToDelete, true);
                }
            });

            if (index === channels.length - 1) {
                resolve(deleted);
            }
        });
    });
    return deleteCount;
};

module.exports = {
    purgeMessages,
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Poista viestejä kanavalta!')
        .setDefaultPermission(false)

        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Poista tietyn käyttäjän viestejä kanavalta!')
                .addUserOption(option =>
                    option
                        .setName('käyttäjä')
                        .setDescription('Käyttäjä, jonka viestejä haluat poistaa!')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('aika')
                        .setDescription('Aikajana, jolta käyttäjän viestejä poistetaan!')
                        .addChoice('24h', '1')
                        .addChoice('4d', '4')
                        .addChoice('7d', '7')
                        .setRequired(true),
                ),
        ),

    /**
     * @description Unmute command
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @returns {void}
     */
    async execute(client, interaction) {
        const subCommand = interaction.options.getSubcommand();

        /**
         * @type {GuildMember}
         */
        const member = interaction.options.getMember('käyttäjä');

        /**
         * @type {string}
         */
        const days = interaction.options.getString('aika');

        if (subCommand === 'user') {
            const deleteCount = await purgeMessages(interaction, member, days);

            const purgeEmbed = new MessageEmbed()
                .setColor(process.env.SUCCESS_COLOR)
                .setImage('https://i.stack.imgur.com/Fzh0w.png')
                .setAuthor({ name: 'Viestit poistettu onnistuneesti', iconURL: client.user.displayAvatarURL() })
                .setDescription(
                    // eslint-disable-next-line max-len
                    `Käyttäjän **${member.user.username}** viestit ajalta ${days} päivä(ä) poistettu onnistuneesti.`,
                )
                .addField('Viestejä poistettu', `${await deleteCount}kpl`)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();
            interaction.channel.send({ embeds: [purgeEmbed] });
        }
    },
};
