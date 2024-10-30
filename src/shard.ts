import path from "path";
import { config as discordConf } from './config/discord'
import { prefix as consolePrefix } from "./config/console";
import { ClusterManager } from "discord-hybrid-sharding";

const manager = new ClusterManager(path.join(__dirname, 'index.js'), {
    token: discordConf.DISCORD_TOKEN,
    totalShards: 'auto',
    execArgv: ['-r', './tsconfig-paths.js'],
    shardsPerClusters: 2,
    mode: 'process',
});

manager.on('shardCreate', (shard) => {
    console.log(consolePrefix.shard + `shardCreate [${shard.id}]`);
})

manager.on('clientRequest', (req) => {
    console.log(consolePrefix.shard + `clientRequest`, req);
})

manager.on('clusterCreate', (cluster) => {
    console.log(consolePrefix.shard + `clusterCreate [${cluster.id}]`);
})

manager.on('clusterReady', (cluster) => {
    console.log(consolePrefix.shard + `clusterReady [${cluster.id}]`);
})

manager.on('debug', (debug) => {
    console.log(consolePrefix.shard + 'DEBUG:', debug);
})

manager.spawn({ timeout: -1 });