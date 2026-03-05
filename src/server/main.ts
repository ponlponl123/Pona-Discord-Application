import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger';
import { createServer } from 'http';
import socketio from 'socket.io';
import path from 'path';
import net from 'net';

import { prefix as consolePrefix, type as consoleType } from '@config/console';
import { errorHandlerPlugin } from './middlewares/errorHandle';
import { initialize as initializeSocket } from './api/ws/socket';
import routes_v1 from './api/REST/v1/routes';
import routes_v2 from './api/REST/v2/routes';

export class apiServer {
  private portUsing: number = 3000;
  public readonly app: Elysia;
  public readonly http: ReturnType<typeof createServer>;
  public readonly io: socketio.Server;

  constructor(port: number) {
    const httpServer = createServer();
    const socket = new initializeSocket(httpServer);

    const app = new Elysia()
      .use(cors({ origin: 'https://pona.ponlponl123.com', credentials: true }))
      .use(
        swagger({
          documentation: {
            info: { title: 'Pona Discord Application API', version: '1.0.0' },
          },
        }),
      )
      .use(
        staticPlugin({
          assets:
            process.env['AUTO_ROUTE'] === 'production'
              ? path.join(__dirname, 'public')
              : path.join(__dirname, '..', '..', 'public'),
          prefix: '/static',
        }),
      )
      .use(errorHandlerPlugin)
      .onBeforeHandle((context) => {
        (context as Record<string, unknown>)['startTime'] = Date.now();
      })
      .onAfterHandle((context) => {
        const duration =
          Date.now() -
          (((context as Record<string, unknown>)['startTime'] as number) ??
            Date.now());
        const status = Number(context.set?.status) || 200;
        const color =
          status >= 200 && status < 400 ? '32m' : status >= 500 ? '31m' : '33m';
        console.log(
          consoleType.info,
          consolePrefix.express +
            `\x1b[2m${new Date()}\x1b[0m | \x1b[${color}${status}\x1b[0m [ ${context.request.method} ] ${new URL(context.request.url).pathname} (${duration}ms)`,
        );
      })
      .get('/', () => ({ status: 200, message: 'Hello, world!' }))
      .use(routes_v1)
      .use(routes_v2);

    this.app = app as any;

    this.http = httpServer;
    this.io = socket.server;
    this.portUsing = port;
    this.checkPortAndListen(port);
  }

  private checkPortAndListen(port: number) {
    const checkPort = (p: number) => {
      const server = net.createServer();
      server.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.log(
            consoleType.warn,
            consolePrefix.express +
              `\x1b[33mPort ${p} is in use, trying next port...\x1b[0m`,
          );
          checkPort(p + 1);
        } else {
          console.error(
            consoleType.error,
            consolePrefix.express +
              `\x1b[31mError occurred: ${err.message}\x1b[0m`,
          );
        }
      });

      server.once('listening', () => {
        server.close();
        this.portUsing = p;

        Bun.serve({
          fetch: this.app.fetch,
          port: this.portUsing,
          idleTimeout: 30,
        });
        console.log(
          consoleType.info,
          consolePrefix.express +
            `\x1b[32mElysia API Server running at ${this.portUsing}!\x1b[0m`,
        );

        this.http.listen(this.portUsing + 1, () => {
          console.log(
            consoleType.info,
            consolePrefix.express +
              `\x1b[32mSocket.IO Server running at ${this.portUsing + 1}!\x1b[0m`,
          );
        });
      });

      server.listen(p);
    };

    checkPort(port);
  }
}
