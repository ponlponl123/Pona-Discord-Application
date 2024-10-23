import express from 'express'
import { HttpStatusCode } from 'axios';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { prefix as consolePrefix } from 'config/console'

// Middleware handlers
import Middleware_errorHandler from './middlewares/errorHandle'
import Middleware_debugRequest from './middlewares/debugRequest'

export function createHttpServer(port: number) {
    const app = express();

    app.use( bodyParser.json() );
    app.use( cookieParser() );
    Middleware_errorHandler(app);
    Middleware_debugRequest(app);

    app.get('/', (req: express.Request, res: express.Response) => {
        res.status(HttpStatusCode.Ok).json({
            status: HttpStatusCode.Ok,
            message: 'Hello, world!'
        });
    })

    app.listen(port);

    console.log(consolePrefix.system + `\x1b[32mAPI Server running at ${port}! 📡\x1b[0m`);

    return app;
}