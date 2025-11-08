import path from 'path';
import { config as discordConf } from './config/discord';
import { prefix as consolePrefix } from './config/console';
import {
  ClusterManager,
  ReClusterManager,
  HeartbeatManager,
  BaseMessage,
  messageType,
} from 'discord-hybrid-sharding';

const manager = new ClusterManager(path.join(__dirname, 'index.js'), {
  token: discordConf.DISCORD_TOKEN,
  totalShards: 'auto',
  // Only use tsconfig-paths in development (when running from src/)
  execArgv:
    process.env.NODE_ENV === 'production' ? [] : ['-r', './tsconfig-paths.js'],
  shardsPerClusters: 2,
  mode: 'process',
});

manager.extend(
  new ReClusterManager(),
  new HeartbeatManager({
    interval: 2000, // Interval to send a heartbeat
    maxMissedHeartbeats: 5, // Maximum amount of missed Heartbeats until Cluster will get respawned
  }),
);

manager.on('shardCreate', (shard) => {
  console.log(consolePrefix.shard + `shardCreate [${shard.id}]`);
});

manager.on('clientRequest', (req) => {
  console.log(consolePrefix.shard + `clientRequest`, req);
});

manager.on('clusterCreate', (cluster) => {
  console.log(consolePrefix.shard + `clusterCreate [${cluster.id}]`);
  cluster.on('message', (message) => {
    console.log(message);
    if ((message as BaseMessage)['_type'] !== messageType.CUSTOM_REQUEST)
      return; // Check if the message needs a reply
    (message as BaseMessage)['reply']({ content: 'hello world' });
  });
  cluster.on('death', (_cluster) => {
    if (_cluster.restarts.current >= _cluster.restarts.max) {
      new Error(
        consolePrefix.shard +
          `Cluster [${_cluster.id}] has been killed after reaching max restarts.`,
      );
      process.exit(1); // Exit the process if the cluster has been killed after reaching max restarts
    } else
      console.log(
        consolePrefix.shard +
          `Cluster [${_cluster.id}] has been killed, restarting...`,
      );
  });
  setInterval(() => {
    cluster.send({ content: 'I am alive' }); // Send a message to the client
    cluster
      .request({ content: 'Are you alive?', alive: true })
      .then((e) => console.log(e)); // Send a message to the client
  }, 5000);
});

manager.on('clusterReady', (cluster) => {
  console.log(consolePrefix.shard + `clusterReady [${cluster.id}]`);
});

manager.on('debug', (debug) => {
  console.log(consolePrefix.shard + 'DEBUG:', debug);
});

manager.spawn({ timeout: -1 });
