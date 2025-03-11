import express from 'express';
import { HttpStatusCode } from 'axios';
import { getInfo } from 'discord-hybrid-sharding'

export const path = '/:guildId?';

export function GET_PRIVATE(_request: express.Request, response: express.Response) {
    try {
        const shardInfo = getInfo();
        const lastShard = shardInfo.LAST_SHARD_ID;
        const firstShard = shardInfo.FIRST_SHARD_ID;
        const totalShards = shardInfo.TOTAL_SHARDS;
        const shardList = shardInfo.SHARD_LIST;
    
        return response.status(HttpStatusCode.Ok).json({
            message: 'OK',
            lastShard: lastShard,
            firstShard: firstShard,
            totalShards: totalShards,
            shardList: shardList
        });
    } catch (error) {
        // console.error(error);
        return response.status(HttpStatusCode.InternalServerError).json({ error: 'An error occurred while fetching shard information OR Shard is not enabled.' });
    }
}