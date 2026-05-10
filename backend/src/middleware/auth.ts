import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_smarthealth';

export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

export const requireRole = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    }
    next();
  };

export const requireSelfOrRole = (idParamKey: string, ...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: Missing auth context.' });
    }
    const targetId = Number(req.params[idParamKey]);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({ message: `Invalid ${idParamKey}.` });
    }
    if (req.user.id === targetId || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Cannot access this resource.' });
  };
