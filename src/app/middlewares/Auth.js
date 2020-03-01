import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import User from '../models/User';

import authConfig from '../../config/auth';

class Auth {
  static async verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided' });
    }
    const [, token] = authHeader.split(' ');
    try {
      // It is more efficient to use the async version of jwt.verify
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);
      // Sets userId for next middlewares
      req.userId = decoded.id;
      return next();
    } catch (error) {
      // Invalid token
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  static async verifyAdminUser(req, res, next) {
    try {
      const user = await User.findByPk(req.userId);
      if (!user.admin) {
        return res.status(401).json({ error: 'User is not admin' });
      }
      return next();
    } catch (error) {
      // User is not admin
      return res.status(401).json({ error });
    }
  }
}

export default Auth;
