import { CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, GuildMember, CommandInteractionOption } from "discord.js";
import { lavaPlayer } from "@/interfaces/lavaPlayer";
import errorEmbedBuilder from "@/utils/embeds/error";

import playSubsystem from './music/play';
import stopSubsystem from './music/leave';
import skipSubsystem from './music/skip';
import pauseSubsystem from './music/pause';
import loopSubsystem from './music/loop';
import loopQueueSubsystem from './music/loop_queue';

import isPonaInVoiceChannel from "@/utils/isPonaInVoiceChannel";

export const data = new SlashCommandBuilder()
    .setName("music")
    .setDescription("Category about pona music player")
    .addSubcommand(subcommand => subcommand
        .setName('play')
        .setDescription('Add music to queue')
        .addStringOption(option => option
            .setName('input')
            .setDescription('Youtube video title')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName('stop')
        .setDescription('Stop music and leave voice channel')
    )
    .addSubcommand(subcommand => subcommand
        .setName('pause')
        .setDescription('Toggle music playback state')
    )
    .addSubcommand(subcommand => subcommand
        .setName('resume')
        .setDescription('Toggle music playback state')
    )
    .addSubcommand(subcommand => subcommand
        .setName('skip')
        .setDescription('Skip current track')
    )
    .addSubcommand(subcommand => subcommand
        .setName('loop')
        .setDescription('Set looping playback state')
        .addStringOption(option => option
            .setName('state')
            .setDescription('Repeat states')
            .addChoices({
                name: 'Track',
                value: 'track'
            })
            .addChoices({
                name: 'Queue',
                value: 'queue'
            })
            .addChoices({
                name: 'Off',
                value: 'off'
            })
            .setRequired(true)
        )
    )

export async function execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const subCommand = (interaction.options as CommandInteractionOptionResolver<CacheType>).getSubcommand();

    switch ( subCommand ) {
        case 'play':
            return playSubsystem(interaction);
        case 'stop':
            return stopSubsystem(interaction);
        case 'skip':
            return skipSubsystem(interaction);
        case 'pause':
        case 'resume':
            {
                const playback = isPonaInVoiceChannel( member.guild.id, 'player' ) as lavaPlayer[];
                return pauseSubsystem(interaction, playback.length > 0 && !playback[0].player.paused);
            }
        case 'loop':
            {
                const state = interaction.options.get('state') as CommandInteractionOption<CacheType>;
                switch (state.value) {
                    case 'track':
                        {
                            loopSubsystem(interaction, true, false);
                            return interaction.reply({
                                content: 'Repeat state: Only this track'
                            })
                        }
                    case 'queue':
                        {
                            loopQueueSubsystem(interaction, true, false);
                            return interaction.reply({
                                content: 'Repeat state: This queue'
                            })
                        }
                    default:
                        {
                            loopSubsystem(interaction, false, false);
                            loopQueueSubsystem(interaction, false, false);
                            return interaction.reply({
                                content: 'Repeat state: Off'
                            })
                        }
                }
            }
        default:
            return interaction.reply({
                embeds: [errorEmbedBuilder('Invalid subcommand.')]
            });
    }
}