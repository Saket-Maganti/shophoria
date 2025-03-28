const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('auth middleware - Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('auth middleware - Error verifying token:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};