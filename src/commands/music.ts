import { CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, GuildMember, CommandInteractionOption } from "discord.js";
import { lavaPlayer } from "@interfaces/player";
import isAvailable from "@utils/player/isAvailable";
import errorEmbedBuilder from "@utils/embeds/error";

import playSubsystem from './music/play';
import stopSubsystem from './music/leave';
import skipSubsystem from './music/skip';
import pauseSubsystem from './music/pause';
import queueSubsystem from './music/queue';
import loopSubsystem from './music/loop';
import loopQueueSubsystem from './music/loop_queue';

import isPonaInVoiceChannel from "@/utils/isPonaInVoiceChannel";

export const data = new SlashCommandBuilder()
    .setName("music")
    .setDescription("Category about pona music player")
	.setNameLocalizations({
		th: 'เพลง',
	})
    .setDescriptionLocalizations({
        th: 'คำสั่งเกี่ยวกับเพลง, วิดีโอ และสตรีมมิ่ง',
    })
    .addSubcommand(subcommand => subcommand
        .setName('play')
        .setDescription('Add music to queue')
        .setNameLocalizations({
            th: 'เล่น',
        })
        .setDescriptionLocalizations({
            th: 'เพิ่มเพลงลงคิว',
        })
        .addStringOption(option => option
            .setName('input')
            .setDescription('Youtube video title')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName('stop')
        .setNameLocalizations({
            th: 'หยุด',
        })
        .setDescriptionLocalizations({
            th: 'หยุดเพลงทั้งหมดในคิวและออกจากช่องแชทเสียง',
        })
        .setDescription('Stop music and leave voice channel')
    )
    .addSubcommand(subcommand => subcommand
        .setName('pause')
        .setNameLocalizations({
            th: 'หยุดชั่วคราว',
        })
        .setDescriptionLocalizations({
            th: 'หยุด/เล่นเพลงที่อยู่ในแทร็ก',
        })
        .setDescription('Toggle music playback state')
    )
    .addSubcommand(subcommand => subcommand
        .setName('resume')
        .setNameLocalizations({
            th: 'เล่นต่อ',
        })
        .setDescriptionLocalizations({
            th: 'หยุด/เล่นเพลงที่อยู่ในแทร็ก',
        })
        .setDescription('Toggle music playback state')
    )
    .addSubcommand(subcommand => subcommand
        .setName('skip')
        .setNameLocalizations({
            th: 'ข้าม',
        })
        .setDescriptionLocalizations({
            th: 'ข้ามเพลงที่กำลังเล่นอยู่',
        })
        .setDescription('Skip current track')
    )
    .addSubcommand(subcommand => subcommand
        .setName('queue')
        .setNameLocalizations({
            th: 'คิว',
        })
        .setDescriptionLocalizations({
            th: 'แสดงคิวเพลงทั้งหมด',
        })
        .setDescription('Display queue information')
    )
    .addSubcommand(subcommand => subcommand
        .setName('loop')
        .setDescription('Set looping playback state')
        .setNameLocalizations({
            th: 'วนซ้ำ',
        })
        .setDescriptionLocalizations({
            th: 'กำหนดโหมดวนซ้ำ',
        })
        .addStringOption(option => option
            .setName('state')
            .setDescription('Repeat states')
            .addChoices({
                name: 'Track',
                name_localizations: {
                    'th': 'เฉพาะแทร็ก'
                },
                value: 'track'
            })
            .addChoices({
                name: 'Queue',
                name_localizations: {
                    'th': 'คิวทั้งหมด'
                },
                value: 'queue'
            })
            .addChoices({
                name: 'Off',
                name_localizations: {
                    'th': 'ปิด'
                },
                value: 'off'
            })
            .setRequired(true)
        )
    )

export async function execute(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;
    const subCommand = (interaction.options as CommandInteractionOptionResolver<CacheType>).getSubcommand();
    const isLavalinkIsAvailable = await isAvailable();

    if ( !isLavalinkIsAvailable )
        return interaction.reply({
            embeds: [errorEmbedBuilder('Service is not available right now :(')],
            ephemeral: true
        });

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
        case 'queue':
            return queueSubsystem(interaction);
        case 'loop':
            {
                const state = interaction.options.get('state') as CommandInteractionOption<CacheType>;
                switch (state.value) {
                    case 'track':
                        {
                            if (
                                await loopSubsystem(interaction, true, false) === true &&
                                interaction.isRepliable()
                            )
                                return interaction.reply({
                                    content: 'Repeat state: Only this track'
                                })
                            else
                                return;
                        }
                    case 'queue':
                        {
                            if (
                                await loopQueueSubsystem(interaction, true, false) === true &&
                                interaction.isRepliable()
                            )
                                return interaction.reply({
                                    content: 'Repeat state: This queue'
                                })
                            else
                                return;
                        }
                    default:
                        {
                            if (
                                await loopSubsystem(interaction, false, false) === true &&
                                interaction.isRepliable()
                            )
                                if (
                                    await loopQueueSubsystem(interaction, false, false) === true &&
                                    interaction.isRepliable()
                                )
                                    return interaction.reply({
                                        content: 'Repeat state: Off'
                                    })
                                else
                                    return;
                            else
                                return;
                        }
                }
                return;
            }
        default:
            return interaction.reply({
                embeds: [errorEmbedBuilder('Invalid subcommand.')]
            });
    }
}