import { redisClient, ytmusic } from "@/index";
import { SongDetailed } from "@/interfaces/ytmusic-api";
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { VideoFull } from "ytmusic-api";

export async function IsValidVideo(videoId: string): Promise<boolean> {
    try {
        if (
            redisClient?.redis &&
            (
                await redisClient.redis.get(`yt:video:v1:${videoId}`) ||
                await redisClient.redis.get(`yt:video:v2:${videoId}:info`)
            ) ||
            (
                await ytmusic.client.getVideo(videoId) ||
                await YTMusicAPI('GET', `song/${encodeURIComponent(videoId)}`)
            )
        ) return true;

        return false;
    }
    catch (error) {
        return false;
    }
}

export async function getVideo(videoId: string): Promise<false | { message: string, result: {v1: VideoFull | undefined, v2: SongDetailed | undefined} }> {
    if ( redisClient?.redis )
    {
        let redis_video_detail_v1 = await redisClient.redis.get(`yt:video:v1:${videoId}`);
        let redis_video_detail_v2 = await redisClient.redis.get(`yt:video:v2:${videoId}:info`);
        if ( redis_video_detail_v1 || redis_video_detail_v2 )
        {
            if ( !redis_video_detail_v1&&redis_video_detail_v1!=='' )
            {
                const fetch = await ytmusic.client.getVideo(videoId).catch(()=>{
                    redisClient?.redis.setex(`yt:video:v1:${videoId}`, 600, '');
                });
                if ( fetch )
                {
                    redis_video_detail_v1 = JSON.stringify(fetch);
                    redisClient?.redis.setex(`yt:video:v1:${videoId}`, 1800, redis_video_detail_v1);
                }
            }
            if ( !redis_video_detail_v2&&redis_video_detail_v2!=='' )
            {
                const fetch = await YTMusicAPI('GET', `song/${encodeURIComponent(videoId)}`).catch(()=>{
                    redisClient?.redis.setex(`yt:video:v2:${videoId}:info`, 600, '');
                });
                if ( fetch )
                {
                    redis_video_detail_v2 = JSON.stringify(fetch.data.result);
                    redisClient?.redis.setex(`yt:video:v2:${videoId}:info`, 1800, redis_video_detail_v2);
                }
            }
            const safeRedisVideoDetailV1 = redis_video_detail_v1&&redis_video_detail_v1!=='' ? JSON.parse(redis_video_detail_v1) : null;
            const safeRedisVideoDetailV2 = redis_video_detail_v2&&redis_video_detail_v2!=='' ? JSON.parse(redis_video_detail_v2) : null;
            return {
                message: 'Ok',
                result: {
                    v1: safeRedisVideoDetailV1,
                    v2: safeRedisVideoDetailV2
                }
            }
        }
    }

    const video_detail_v1 = await ytmusic.client.getVideo(videoId).catch(() => {
        redisClient?.redis.setex(`yt:video:v1:${videoId}`, 600, '');
    });
    const video_detail_v2 = await YTMusicAPI('GET', `song/${encodeURIComponent(videoId)}`).catch(() => {
        redisClient?.redis.setex(`yt:video:v2:${videoId}:info`, 600, '');
    });

    const safeVideoDetailV1 = video_detail_v1 ? { ...video_detail_v1 } as VideoFull : undefined;
    const safeVideoDetailV2 = video_detail_v2 ? { ...video_detail_v2.data.result } as SongDetailed : undefined;

    if (safeVideoDetailV1) redisClient?.redis.setex(`yt:video:v1:${videoId}`, 1800, JSON.stringify(safeVideoDetailV1));
    if (safeVideoDetailV2) redisClient?.redis.setex(`yt:video:v2:${videoId}:info`, 1800, JSON.stringify(safeVideoDetailV2));

    return {
        message: 'Ok',
        result: {
            v1: safeVideoDetailV1,
            v2: safeVideoDetailV2
        }
    }
}