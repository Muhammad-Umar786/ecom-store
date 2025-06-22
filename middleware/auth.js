// middleware/auth.js
const jwt = require('jsonwebtoken');

// Verifies JWT/session and attaches req.user
exports.authenticate = (req, res, next) => {
  let token = req.session?.token
            || (req.headers.authorization?.startsWith('Bearer ')
                && req.headers.authorization.split(' ')[1])
            || req.body.token;

  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Checks that req.user.role === 'admin'
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privilege required' });
  }
  next();
};
