// middlewares/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

/**
 * After login/signup, sign & store token in session
 */
function createSessionToken(req, user) {
  const payload = { id: user._id, role: user.role };
  const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });
  req.session.token = token;
}

/**
 * Decode token and, if valid, load user into req.user
 */
async function attachUser(req, res, next) {
  const token = req.session.token;
  if (!token) return next();

  try {
    const { id } = jwt.verify(token, SECRET);
    req.user = await User.findById(id).select('-password');
  } catch (err) {
    // invalid or expired token: just ignore
  }

  next();
}

/**
 * Require login—if no req.user, redirect to /login
 */
function reqAuth(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
}

/**
 * Optional auth: load req.user if token present, but always allow through
 */
async function optAuth(req, res, next) {
  // reuse attachUser logic
  const token = req.session.token;
  if (token) {
    try {
      const { id } = jwt.verify(token, SECRET);
      req.user = await User.findById(id).select('-password');
    } catch (err) { /* ignore */ }
  }
  next();
}

/**
 * Require admin role—redirect to home if not admin
 */
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  createSessionToken,
  attachUser,
  optAuth,
  reqAuth,
  isAdmin,
};
