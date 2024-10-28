import express from 'express';

export default function errorHandler( err: Error, req: express.Request, res: express.Response, next: express.NextFunction ): void {
    console.error(err.stack);
    res.status(500).send('Something broke!')
}