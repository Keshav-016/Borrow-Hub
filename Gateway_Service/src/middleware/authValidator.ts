import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import ENV from '../Env';

interface JwtPayload {
  userId: string;
  role: string;
}
const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('authorization'); // use req.get to avoid index-signature errors
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  const secret = ENV.JWT_SECRET;
  if (!secret) return res.status(500).send('JWT_SECRET not set');

    verify(token, secret,  (err, decoded) => {
    if (err) return res.sendStatus(403);

    const payload = decoded as JwtPayload ;
    if (!payload || !payload.userId) return res.sendStatus(403);

    // add to headers (use lowercase custom header names)
    req.headers['user-id'] = payload.userId;
    req.headers['user-role'] = payload.role;

    next();
  });
};

export default AuthMiddleware;