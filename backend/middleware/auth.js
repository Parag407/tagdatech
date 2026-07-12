const jwt = require('jsonwebtoken');

const adminVerify = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretcyberkey');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access forbidden. Admin role is required.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed. Invalid or expired token.' });
  }
};

module.exports = { adminVerify };
