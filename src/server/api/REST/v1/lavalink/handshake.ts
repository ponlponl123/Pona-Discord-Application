import { Elysia } from 'elysia';
import { HttpStatusCode } from '@/types/http';
import { container } from '@/core/container';

export default new Elysia().get('/', async ({ set }) => {
  const nodes = container.lavalink?.manager?.nodes;
  if (!nodes || nodes.size === 0) {
    set.status = HttpStatusCode.ServiceUnavailable;
    return {
      status: 'down',
      message: 'No Lavalink nodes configured',
      totalNodes: 0,
      connectedNodes: 0,
    };
  }

  const nodeArray = Array.from(nodes.values());
  const connectedNodes = nodeArray.filter((n) => n.connected);

  if (connectedNodes.length === 0) {
    set.status = HttpStatusCode.ServiceUnavailable;
    return {
      status: 'down',
      message: 'All Lavalink nodes are disconnected',
      totalNodes: nodeArray.length,
      connectedNodes: 0,
    };
  }

  let degraded = connectedNodes.length < nodeArray.length;
  let hasWorkingNode = false;

  for (const node of connectedNodes) {
    if (!node.sessionId) {
      degraded = true;
      continue;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const url = `http${node.options.secure ? 's' : ''}://${node.options.host}:${node.options.port}/v4/info`;
      const res = await fetch(url, {
        headers: {
          Authorization: node.options.password as string,
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        degraded = true;
        continue;
      }

      const stats = node.stats;
      if (stats?.cpu) {
        const lavalinkLoad =
          (stats.cpu.lavalinkLoad / (stats.cpu.cores || 1)) * 100;
        const systemLoad =
          (stats.cpu.systemLoad / (stats.cpu.cores || 1)) * 100;
        if (lavalinkLoad > 85 || systemLoad > 90) {
          degraded = true;
        }
      }

      hasWorkingNode = true;
    } catch {
      degraded = true;
    }
  }

  if (!hasWorkingNode) {
    set.status = HttpStatusCode.ServiceUnavailable;
    return {
      status: 'down',
      message: 'Lavalink nodes are unresponsive',
      totalNodes: nodeArray.length,
      connectedNodes: connectedNodes.length,
    };
  }

  if (degraded) {
    set.status = HttpStatusCode.Ok;
    return {
      status: 'degraded',
      message: 'Lavalink service is degraded',
      totalNodes: nodeArray.length,
      connectedNodes: connectedNodes.length,
    };
  }

  set.status = HttpStatusCode.Ok;
  return {
    status: 'operational',
    message: 'OK',
    totalNodes: nodeArray.length,
    connectedNodes: connectedNodes.length,
  };
});

