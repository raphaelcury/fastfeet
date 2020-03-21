const authConfig = {
  secret: process.env.AUTH_SECRET,
  expiresIn: process.env.AUTH_SESSION_EXPIRATION,
  adminPass: process.env.AUTH_ADMIN_PASS,
  saltRounds: process.env.AUTH_SALT_ROUNDS,
};

export default authConfig;
