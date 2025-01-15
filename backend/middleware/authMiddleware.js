import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
      next();
      return;
    }
    
    const admin = await Admin.findById(decoded.id).select('-adminCode');
    if (admin) {
      req.admin = admin;
      next();
      return;
    }

    throw new Error('Not authorized');
  } catch (error) {
    res.clearCookie('token');
    res.status(401);
    throw new Error('Not authorized');
  }
});

export const protectAdmin = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-adminCode');

    if (!admin) {
      res.status(401);
      throw new Error('Not authorized as admin');
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.status(401);
    throw new Error('Not authorized');
  }
});

export default protect;
