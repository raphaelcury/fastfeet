import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

class Auth {
  static async verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided' });
    }
    const [, token] = authHeader.split(' ');
    try {
      // Usar versão assíncrona pois é mais eficiente
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);
      // Seta id do usuário para ser usado nas reqs seguintes
      req.userId = decoded.id;
      return next();
    } catch (error) {
      // Token inválido
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}

export default Auth;
