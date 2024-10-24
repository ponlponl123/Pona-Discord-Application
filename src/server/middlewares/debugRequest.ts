import express from "express";
import { prefix as consolePrefix } from '@config/console'

export default function Debugger(app: express.Application) {
    app.use(( req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(consolePrefix.express + `\x1b[2m${new Date}\x1b[0m | \x1b[32m${res.statusCode}\x1b[0m [ ${req.method} ${req.protocol} ] ${req.originalUrl}`);
        next();
    })
}