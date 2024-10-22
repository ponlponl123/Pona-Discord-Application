import express from 'express';

export default function errorHandler( app: express.Application ) {
    return app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    })
}