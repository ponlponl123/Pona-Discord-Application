import { redisClient, ytmusic } from "@/index";
import { ArtistFull as ArtistFullV2, ProfileFull } from "@/interfaces/ytmusic-api";
import YTMusicAPI from '@/utils/ytmusic-api/request';
import { ArtistFull } from "ytmusic-api";

export async function IsValidChannel(channelId: string): Promise<boolean> {
    try {
        if (
            redisClient?.redis &&
            (
                await redisClient.redis_ReadOnly.get(`yt:artist:v1:${channelId}`) ||
                await redisClient.redis_ReadOnly.get(`yt:artist:v2:${channelId}:info`) ||
                await redisClient.redis_ReadOnly.get(`yt:user:${channelId}:info`)
            ) ||
            (
                await ytmusic.client.getArtist(channelId) ||
                await YTMusicAPI('GET', `user/${encodeURIComponent(channelId)}`) ||
                await YTMusicAPI('GET', `artist/${encodeURIComponent(channelId)}`)
            )
        ) return true;

        return false;
    }
    catch (error) {
        return false;
    }
}

export async function getChannel(channelId: string): Promise<false | { message: string, result: {v1: ArtistFull | undefined, v2: ArtistFullV2 | undefined, user: ProfileFull | undefined} }> {
    if ( redisClient?.redis )
    {
        let redis_artist_detail_v1 = await redisClient.redis_ReadOnly.get(`yt:artist:v1:${channelId}`);
        let redis_artist_detail_v2 = await redisClient.redis_ReadOnly.get(`yt:artist:v2:${channelId}:info`);
        let redis_user_detail = await redisClient.redis_ReadOnly.get(`yt:user:${channelId}:info`);
        if ( redis_artist_detail_v1 || redis_artist_detail_v2 || redis_user_detail )
        {
            if ( !redis_artist_detail_v1&&redis_artist_detail_v1!=='' )
            {
                const fetch = await ytmusic.client.getArtist(channelId).catch(()=>{
                    redisClient?.redis.setex(`yt:artist:v1:${channelId}`, 600, '');
                });
                if ( fetch )
                {
                    redis_artist_detail_v1 = JSON.stringify(fetch);
                    redisClient?.redis.setex(`yt:artist:v1:${channelId}`, 1800, redis_artist_detail_v1);
                }
            }
            if ( !redis_artist_detail_v2&&redis_artist_detail_v2!=='' )
            {
                const fetch = await YTMusicAPI('GET', `artist/${encodeURIComponent(channelId)}`).catch(()=>{
                    redisClient?.redis.setex(`yt:artist:v2:${channelId}:info`, 600, '');
                });
                if ( fetch )
                {
                    redis_artist_detail_v2 = JSON.stringify(fetch.data.result);
                    redisClient?.redis.setex(`yt:artist:v2:${channelId}:info`, 1800, redis_artist_detail_v2);
                }
            }
            if ( !redis_user_detail&&redis_user_detail!=='' )
            {
                const fetch = await YTMusicAPI('GET', `user/${encodeURIComponent(channelId)}`).catch(()=>{
                    redisClient?.redis.setex(`yt:user:${channelId}:info`, 600, '');
                });
                if ( fetch )
                {
                    redis_user_detail = JSON.stringify(fetch.data.result);
                    redisClient?.redis.setex(`yt:user:${channelId}:info`, 1800, redis_user_detail);
                }
            }
            const safeRedisArtistDetailV1 = redis_artist_detail_v1&&redis_artist_detail_v1!=='' ? JSON.parse(redis_artist_detail_v1) : null;
            const safeRedisArtistDetailV2 = redis_artist_detail_v2&&redis_artist_detail_v2!=='' ? JSON.parse(redis_artist_detail_v2) : null;
            const safeRedisUsrDetail = redis_user_detail&&redis_user_detail!=='' ? JSON.parse(redis_user_detail) : null;
            return {
                message: 'Ok',
                result: {
                    v1: safeRedisArtistDetailV1,
                    v2: safeRedisArtistDetailV2,
                    user: safeRedisUsrDetail,
                }
            }
        }
    }

    const artist_detail_v1 = await ytmusic.client.getArtist(channelId).catch(() => {
        redisClient?.redis.setex(`yt:artist:v1:${channelId}`, 600, '');
    });
    const usr_detail = await YTMusicAPI('GET', `user/${encodeURIComponent(channelId)}`).catch(() => {
        redisClient?.redis.setex(`yt:user:${channelId}:info`, 600, '');
    });
    const artist_detail_v2 = await YTMusicAPI('GET', `artist/${encodeURIComponent(channelId)}`).catch(() => {
        redisClient?.redis.setex(`yt:artist:v2:${channelId}:info`, 600, '');
    });

    const safeArtistDetailV1 = artist_detail_v1 ? { ...artist_detail_v1 } : undefined;
    const safeArtistDetailV2 = artist_detail_v2 ? { ...artist_detail_v2.data.result } : undefined;
    const safeUsrDetail = usr_detail ? { ...usr_detail.data.result } : undefined;

    if (safeArtistDetailV1) redisClient?.redis.setex(`yt:artist:v1:${channelId}`, 1800, JSON.stringify(safeArtistDetailV1));
    if (safeArtistDetailV2) redisClient?.redis.setex(`yt:artist:v2:${channelId}:info`, 1800, JSON.stringify(safeArtistDetailV2));
    if (safeUsrDetail) redisClient?.redis.setex(`yt:user:${channelId}:info`, 1800, JSON.stringify(safeUsrDetail));

    return {
        message: 'Ok',
        result: {
            v1: safeArtistDetailV1,
            v2: safeArtistDetailV2,
            user: safeUsrDetail,
        }
    }
}