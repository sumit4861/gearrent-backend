const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '2d'});
};

//POST /auth/register
exports.register = async (req, res) => {
  try {
    console.log('DB name:', mongoose.connection.db.databaseName);
    const {name, email, password, location} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({message: 'Email already in use'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, location
    });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        locaton: user.lcoation,
        avatar: user.avatar
      }
    });
  } catch(err) {
    res.status(500).json({message: 'Server error', error: err.message});
  }
}

//POST /auth/login
exports.login = async (req, res) => {
  try{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
      return res.json({message: "Invalid email or password"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);

    res.status(200).json({
      token, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        avatar: user.avatar
      }
    });

  } catch(err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


exports.getMe = async (req, res) => {
  try {
    // const user = await User.findById(req.body).select('-password');
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};