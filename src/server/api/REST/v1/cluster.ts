import { Elysia } from 'elysia';
import { HttpStatusCode } from 'axios';
import { getInfo } from 'discord-hybrid-sharding';

export default new Elysia().get('/cluster', ({ set }) => {
  try {
    const shardInfo = getInfo();
    const lastShard = shardInfo?.LAST_SHARD_ID;
    const firstShard = shardInfo?.FIRST_SHARD_ID;
    const totalShards = shardInfo?.TOTAL_SHARDS;
    const shardList = shardInfo?.SHARD_LIST;

    set.status = HttpStatusCode.Ok;
    return {
      message: 'OK',
      lastShard: lastShard,
      firstShard: firstShard,
      totalShards: totalShards,
      shardList: shardList,
    };
  } catch (error) {
    // console.error(error);
    set.status = HttpStatusCode.InternalServerError;
    return {
      error:
        'An error occurred while fetching shard information OR Shard is not enabled.',
    };
  }
});
