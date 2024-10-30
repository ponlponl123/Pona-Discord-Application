import express from 'express';
import { HttpStatusCode } from 'axios';
import { getInfo } from 'discord-hybrid-sharding'

export const path = '/:guildId?';

export function GET_PRIVATE(request: express.Request, response: express.Response) {
    const lastShard = getInfo().LAST_SHARD_ID;
    const firstShard = getInfo().FIRST_SHARD_ID;
    const totalShards = getInfo().TOTAL_SHARDS;
    const shardList = getInfo().SHARD_LIST;

    return response.status(HttpStatusCode.Ok).json({
        message: 'OK',
        lastShard: lastShard,
        firstShard: firstShard,
        totalShards: totalShards,
        shardList: shardList
    });
}