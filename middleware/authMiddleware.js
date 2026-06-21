const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    // console.log('Auth header: ', req.headers.authorization);

    if(!req.headers.authorization || req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
      return res.status(401).json({message: 'Not authorized, no token'});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("decoded: ", decoded);

    req.user = await User.findById(decoded.id).select('-password');
    // console.log('req.user:', req.user);
    if(!req.user) {
      return res.status(401).json({message: 'User not found'});
    }
    // req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}