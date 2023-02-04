import jwt from 'jsonwebtoken';

// middleware to validate token (rutas protegidas)
export const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  } else {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      return next();
    } catch (error) {
      return res.status(400).json({ error: 'Invalid token' });
    }
  }
};
