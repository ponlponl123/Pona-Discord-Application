import { CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, GuildMember, CommandInteractionOption, EmbedBuilder } from "discord.js";
import isAvailable from "@utils/player/isAvailable";
import errorEmbedBuilder from "@utils/embeds/error";

import playSubsystem from './music/play';
import stopSubsystem from './music/leave';
import skipSubsystem from './music/skip';
import skiptoSubsystem from './music/skipto';
import pauseSubsystem from './music/pause';
import queueSubsystem from './music/queue';
import removeSubsystem from './music/remove';
import loopSubsystem from './music/loop';
import loopQueueSubsystem from './music/loop_queue';

import isPonaInVoiceChannel from "@/utils/isPonaInVoiceChannel";
import color from "@/config/embedColor";

import { SearchPlatforms } from "@/interfaces/manager";
import { getGuildLanguage } from "@/utils/i18n";

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
            .setDescription('Searching for')
            .setDescriptionLocalizations({
                th: 'กำลังค้นหาเพลงอะไรหรอ?'
            })
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('search_engine')
            .setDescription('Search Engine')
            .setDescriptionLocalizations({
                th: 'เครื่องมือค้นหา'
            })
            .setChoices(
                SearchPlatforms.map((platform) => ({
                    name: platform.replace(
                        /\w\S*/g,
                        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
                    ),
                    value: platform
                }))
            )
            .setRequired(false)
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
        .setName('skipto')
        .setNameLocalizations({
            th: 'ข้ามไปที่คิว',
        })
        .setDescriptionLocalizations({
            th: 'ข้ามทั้งหมดก่อนหน้าและไปยังคิวที่เลือก',
        })
        .setDescription('Skip all previous and go to selected queue.')
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
        .setName('remove')
        .setNameLocalizations({
            th: 'ลบ',
        })
        .setDescriptionLocalizations({
            th: 'ลบเพลงออกจากคิว',
        })
        .setDescription('Remove selected track from queue.')
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
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    try {
        const lang = getGuildLanguage(interaction.guildId as string);
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
            case 'skipto':
                return skiptoSubsystem(interaction);
            case 'pause':
            case 'resume':
                {
                    const playback = await isPonaInVoiceChannel( member.guild.id );
                    return pauseSubsystem(interaction, playback && !playback.paused);
                }
            case 'queue':
                return queueSubsystem(interaction);
            case 'remove':
                return removeSubsystem(interaction);
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
                                {
                                    const repeatStateEmbed = new EmbedBuilder()
                                        .setTitle(`<:Revertarrow:1299947479571107942> · ${lang.data.music.state.repeat.title}: ${lang.data.music.state.repeat.track}`)
                                        .setColor(color('focus'));
                                    return interaction.reply({
                                        embeds: [repeatStateEmbed]
                                    })
                                }
                                else
                                    return;
                            }
                        case 'queue':
                            {
                                if (
                                    await loopQueueSubsystem(interaction, true, false) === true &&
                                    interaction.isRepliable()
                                )
                                {
                                    const repeatStateEmbed = new EmbedBuilder()
                                        .setTitle(`<:MusicNote:1299943220301529118> · ${lang.data.music.state.repeat.title}: ${lang.data.music.state.repeat.queue}`)
                                        .setColor(color('focus'));
                                    return interaction.reply({
                                        embeds: [repeatStateEmbed]
                                    })
                                }
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
                                    {
                                        const repeatStateEmbed = new EmbedBuilder()
                                            .setTitle(`<:Revertarrowwithslash:1299947493756243989> · ${lang.data.music.state.repeat.title}: ${lang.data.music.state.repeat.off}`)
                                            .setColor(color('light'));
                                        return interaction.reply({
                                            embeds: [repeatStateEmbed]
                                        })
                                    }
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
                    embeds: [errorEmbedBuilder(member.guild.id, lang.data.errors.invalid_subcommand)]
                });
        }
    } catch {
        return;
    }
}