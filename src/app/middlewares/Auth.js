class Auth {
  static verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided' });
    }
    return next();
  }
}

export default Auth;
