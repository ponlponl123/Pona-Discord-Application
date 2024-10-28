import { Request, Response, NextFunction } from 'express';
import { config } from '@/config/express';

export default function apiKeyIsValid(req: Request, res: Response, next: NextFunction): void {
    const authHead = req.headers.authorization;

    if (
        !authHead || authHead.split(' ')[0] !== 'Pona!' ||
        authHead.split(' ')[1] !== config.EXPRESS_SECRET_API_KEY
    ) {
        res.status(401).json({ error: 'Invalid API key' });
        return;
    }

    next();
}