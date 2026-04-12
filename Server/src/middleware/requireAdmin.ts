import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.fomokiller_token;
    if (!token) {
        res.status(401).json({ error: 'No autenticado' });
        return;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        if (payload.role !== 'admin') {
            res.status(403).json({ error: 'Acceso denegado' });
            return;
        }
        (req as any).adminUser = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido' });
    }
};
