import {
    GuildMember,
    CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import warningEmbedBuilder from "@utils/embeds/warning";
import isPonaInVoiceChannel from "@utils/isPonaInVoiceChannel";
import isVoiceActionRequirement from "@utils/player/isVoiceActionRequirement";
import { getGuildLanguage } from "@/utils/i18n";
import color from "@/config/embedColor";

export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause playback')
    .setDMPermission(false);

export default async function execute(interaction: CommandInteraction, value: boolean = true) {
    try {
        const member = interaction.member as GuildMember;
        const lang = getGuildLanguage(member.guild.id);
        const voiceActionRequirement = await isVoiceActionRequirement(member);

        if ( !voiceActionRequirement.isPonaInVoiceChannel ) {
            return interaction.reply({
                embeds: [warningEmbedBuilder(lang.data.music.errors.pona_not_in_voice_channel)],
                ephemeral: true
            });
        }

        if ( !voiceActionRequirement.isUserInVoiceChannel || !voiceActionRequirement.isUserInSameVoiceChannel ) {
            return interaction.reply({
                embeds: [warningEmbedBuilder(lang.data.music.errors.not_same_voice_channel)],
                ephemeral: true
            });
        }

        const playback = await isPonaInVoiceChannel( member.guild.id );

        if ( playback ) {
            playback.pause(value);
            const repeatStateEmbed = new EmbedBuilder()
                .setTitle(`<:Revertarrow:1299947479571107942> · ${value ? lang.data.music.state.paused.true : lang.data.music.state.paused.false}`)
                .setColor(color('focus'));
            return interaction.reply({
                embeds: [repeatStateEmbed]
            })
        }

        return interaction.reply({
            embeds: [warningEmbedBuilder(lang.data.music.errors.no_player_active)],
            ephemeral: true
        });
    } catch {
        return;
    }
}