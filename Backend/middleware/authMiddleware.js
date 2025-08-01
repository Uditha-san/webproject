import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) return res.status(401).json({ message: 'User not found' });

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access forbidden' });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
