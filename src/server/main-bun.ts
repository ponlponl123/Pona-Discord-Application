import { type Server, type ServerWebSocket } from 'bun'
import Redis from 'ioredis';
import staticRoutes from './bun-static-route'

import { prefix as consolePrefix } from '@config/console'

export class PonaDeliver {
    private portUsing: number = 3000;
    public readonly app: Server;
    public readonly redis_pub: Redis | undefined;
    public readonly redis_sub: Redis | undefined;

    constructor(port: number) {
        // const corsHeaders = {
        //     "Access-Control-Allow-Origin": "https://pona.ponlponl123.com",
        //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        //     "Access-Control-Allow-Headers": "Content-Type, Authorization",
        // }
        const app = Bun.serve({
            port: port,
            fetch: this.errorHandler(async (req, server) => {
                console.log(consolePrefix.bun + req.method + " " + req.url);
                if (server.upgrade(req)) {
                    return new Response("Upgrade required", { status: 426 });
                }
                if (req.method === "OPTIONS") return this.corsMiddleware(req);
                const url = new URL(req.url);
                
                if (url.pathname === "/") {
                    return new Response(JSON.stringify({ message: "Hello, world!" }), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                }
        
                return new Response("Not Found", { status: 404 });
            }),
            routes: staticRoutes,
            websocket: {
                message: (ws: ServerWebSocket<undefined>, message: string) => {
                    try {
                        const data = JSON.parse(message);
                        if (data.type === "hello") {
                            ws.send(JSON.stringify({ type: "hello" }));
                        }
                    } catch (err) {
                        console.error("Invalid message received", err);
                    }
                }
            }
        });
    
        this.app = app;
        this.portUsing = port;
        
        console.log(consolePrefix.bun + `\x1b[32mBun API Server running at ${this.portUsing}! 📡\x1b[0m`);
    }

    private errorHandler(fn: (req: Request, server: Server) => Promise<Response>) {
        return async (req: Request, server: Server) => {
            try {
                return await fn(req, server);
            } catch (err) {
                console.error("Server error:", err);
                return new Response(JSON.stringify({ error: "Internal Server Error" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        };
    }    

    private corsMiddleware(_req: Request) {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "https://pona.ponlponl123.com",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }
}