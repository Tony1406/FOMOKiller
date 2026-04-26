import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.fomokiller_token;
    if (!token) {
        res.status(401).json({ error: 'No autenticado' });
        return;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
        (req as any).user = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido' });
    }
};
