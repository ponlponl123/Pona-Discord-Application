import express, { IRouter, IRouterMatcher, Router } from 'express'
import socketio from 'socket.io'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

import cookieParser from 'cookie-parser'
import { HttpStatusCode } from 'axios'
import bodyParser from 'body-parser'

import { prefix as consolePrefix } from '@config/console'

// Middleware handlers
import Middleware_errorHandler from './middlewares/errorHandle'
import Middleware_apikeyHandler from './middlewares/apiKey'

import { initialize as initializeSocket } from './api/ws/socket'
import { Router as PonaRouter, PRIVATE_HTTPMethod, httpMethod, HTTPMethod, HTTPMethods } from '@interfaces/router'

export class apiServer {
    public readonly app: express.Application;
    public readonly socket: socketio.Server;

    constructor(port: number) {
        const app = express();
        const socket = new initializeSocket();
    
        app.disable('x-powered-by');
        app.use(cors({
            origin: 'https://pona.ponlponl123.com',
        }))
        app.use( cookieParser() )
        app.use( bodyParser.json() )
        app.use( Middleware_errorHandler )

        app.use(( req: express.Request, res: express.Response, next: express.NextFunction) => {
            const start = Date.now();
            next();
            res.on('finish', () => {
              const status = res.statusCode;
              const duration = Date.now() - start;
              console.log(consolePrefix.express + `\x1b[2m${new Date}\x1b[0m | \x1b[${status >= 200 && status < 400 ? "32m" : status >= 500 ? "31m" : "33m"}${status}\x1b[0m [ ${req.method} ${req.protocol} ] ${req.originalUrl} (${duration}ms)`);
            });
        })
    
        app.get('/', (req: express.Request, res: express.Response) => {
            res.status(HttpStatusCode.Ok).json({
                status: HttpStatusCode.Ok,
                message: 'Hello, world!'
            });
        })
    
        this.app = app;
        this.socket = socket.server;

        this.router();
        app.listen(port);
        console.log(consolePrefix.express + `\x1b[32mAPI Server running at ${port}! 📡\x1b[0m`);
    }

    private async router() {
        const APIdir = path.join(__dirname, 'api');
        const restAPI_dir = path.join(APIdir, 'REST');

        if ( !fs.existsSync(APIdir) )
            throw new ReferenceError('api directory does not exist');
        if ( !fs.existsSync(restAPI_dir) )
            throw new ReferenceError('rest api directory does not exist');

        fs.readdirSync(restAPI_dir).forEach(dir => {
            const routePath = path.join(restAPI_dir, dir);
            if (fs.lstatSync(routePath).isDirectory()) {
                fs.readdirSync(routePath).forEach(async file => {
                    const filePath = path.resolve(routePath, file);
                    if (fs.lstatSync(filePath).isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
                        const name = path.basename(filePath).split('.')[0];
                        const filePath_esm = 'file://' + filePath;
                        let controller: PonaRouter;
                        try {
                            const test = await import(filePath_esm);
                            controller = test;
                        } catch (err) {
                            console.warn('Failed to import ESM module, retrying with MJS');
                            try {
                                const test = await import(filePath);
                                controller = test;
                            } catch (err) {
                                console.error(consolePrefix.express, `\x1b[31mFailed to import controller: ${filePath}\x1b[0m`);
                                return;
                            }
                        }

                        this.route(name, dir, controller);
                    }
                });
            }
        });
    }

    private route(name: string, version: string, controller: PonaRouter) {
        const router = express.Router();
        const endpoint = name + (controller.path ?? '');
        const endpointPath = `/${endpoint}`;
        for ( const method of HTTPMethods ) {
            const handler = controller[method as HTTPMethod];
            const privateHandler = controller[method+"_PRIVATE" as PRIVATE_HTTPMethod];
            const friendlyMethod = method.toLowerCase();
            if (handler && friendlyMethod in router) {
                router[friendlyMethod as httpMethod](endpointPath, handler);
                console.log(consolePrefix.express, `Routed [${method}] api endpoint:`, version, endpoint, endpointPath);
            }
            if (privateHandler && friendlyMethod in router) {
                router[friendlyMethod as httpMethod](endpointPath, Middleware_apikeyHandler, privateHandler);
                console.log(consolePrefix.express, `Routed PRIVATE [${method}] api endpoint:`, version, endpoint, endpointPath);
            }
        }
        this.app.use(`/${version}`, router);
    }
}