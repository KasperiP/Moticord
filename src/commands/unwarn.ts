import { SlashCommandBuilder } from "@discordjs/builders";
import {
  Client,
  CommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField
} from "discord.js";
import { config } from "../config";
import Warns from "../models/warnModel";

export default {
  data: new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("Poista viimeisin varoitus käyttäjältä!")
    .setDefaultPermission(false)
    .addUserOption((option) =>
      option
        .setName("käyttäjä")
        .setDescription("Käyttäjä, jolta haluat poistaa porttikiellon?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("syy")
        .setDescription("Miksi varoitus poistetaan?")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("hiljainen")
        .setDescription("Haluatko porttikiellon olevan hiljainen (-s)?")
        .setRequired(true)
    ),

  async execute(client: Client, interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const member = interaction.options.getMember("käyttäjä");
    const user = interaction.options.getUser("käyttäjä", true);
    const reason = interaction.options.getString("syy", true);
    const silent = interaction.options.getBoolean("hiljainen", true);

    if (!(member instanceof GuildMember)) return;

    const errorEmbedBase = new EmbedBuilder()
      .setColor(config.COLORS.ERROR)
      .setImage("https://i.stack.imgur.com/Fzh0w.png")
      .setAuthor({
        name: "Tapahtui virhe",
        iconURL: client.user?.displayAvatarURL()
      })
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    if (!member?.id) {
      errorEmbedBase.setDescription(
        `Kyseistä käyttäjää ei löytynyt! Käyttäjä on todennäköisesti poistunut palvelimelta!`
      );
      return interaction.reply({ embeds: [errorEmbedBase], ephemeral: true });
    }

    // Validation
    if (user?.bot) {
      errorEmbedBase.setDescription(`Boteilla ei voi olla varoituksia!`);
      return interaction.reply({ embeds: [errorEmbedBase], ephemeral: true });
    }
    if (user?.id === interaction.user.id) {
      errorEmbedBase.setDescription(`Et voi poistaa varoitusta itseltäsi!`);
      return interaction.reply({ embeds: [errorEmbedBase], ephemeral: true });
    }
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      errorEmbedBase.setDescription(
        `Tällä henkilöllä ei voi olla varoituksia!`
      );
      return interaction.reply({ embeds: [errorEmbedBase], ephemeral: true });
    }
    if (reason.length < 4 || reason.length > 200) {
      errorEmbedBase.setDescription(
        `Varoituksen poistamisen syyn täytyy olla 4-200 merkkiä pitkä!`
      );
      return interaction.reply({ embeds: [errorEmbedBase], ephemeral: true });
    }

    // Get user's active warnings
    const activeWarnings = await Warns.find({
      userID: member.id,
      active: true
    }).sort({ createdAt: -1 });
    if (!activeWarnings || activeWarnings.length === 0) {
      errorEmbedBase.setDescription(
        `Käyttäjällä ei ole aktiivisia varoituksia!`
      );
      return interaction.reply({ embeds: [errorEmbedBase], ephemeral: true });
    }

    // Unwarn latest warning
    const latestWarning = activeWarnings[0];
    await Warns.findOneAndUpdate(
      { _id: latestWarning._id },
      {
        $set: {
          active: false,
          removedType: "manual",
          removedAt: new Date(),
          removedBy: interaction.user.tag
        }
      }
    );
    // New active warnings
    await activeWarnings.shift();

    const unwarnEmbed = new EmbedBuilder()
      .setColor(config.COLORS.SUCCESS)
      .setImage("https://i.stack.imgur.com/Fzh0w.png")
      .setAuthor({
        name: "Viimeisin varoitus poistettu",
        iconURL: client.user?.displayAvatarURL()
      })
      .setDescription(
        `Käyttäjän **${member.user.tag}** viimeisin varoitus on poistettu!`
      )
      .addFields([
        { name: "Käyttäjä", value: `${member.user.tag}`, inline: true },
        { name: "Syynä poistolle", value: `${reason}`, inline: true },
        {
          name: "Poistaja",
          value: `${interaction.user.username}`,
          inline: true
        },
        {
          name: "Aktiiviset varoitukset",
          value: `${activeWarnings.length}/${config.WARN_THRESHOLD}`,
          inline: true
        }
      ])
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ embeds: [unwarnEmbed], ephemeral: silent });

    // Try notifying user about unwarn
    member
      .send({
        // eslint-disable-next-line max-len
        content: `Viimeisin varoituksesi palvelimella **${interaction.guild?.name}** on poistettu. :)`,
        embeds: [unwarnEmbed]
      })
      .catch((e) => {
        if (e?.code === 50007 && silent) {
          return interaction.followUp({
            // eslint-disable-next-line max-len
            content: `<@${interaction.user.id}> Käyttäjälle **${member.user.tag}** ei voitu toimittaa tietoa varoituksen poistosta yksityisviestitse, eikä käyttäjä nää ylläolevaa varoitusviestiä, koska hiljaista tilaa on käytetty! Käyttäjä ei ole tietoinen poistetusta varoituksesta.`,
            ephemeral: true
          });
        }
      });
  }
};
