import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

// Function to verify the token and return either a user or an admin
const verifyTokenAndGetUserOrAdmin = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id).select('-password');
    if (user) {
      return { user };
    }

    let admin = await Admin.findById(decoded.id).select('-adminCode');
    if (admin) {
      return { admin, isAdmin: true };
    }

    return null;
  } catch (error) {
    console.error("Error in token verification:", error);
    return null;
  }
};

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const userOrAdmin = await verifyTokenAndGetUserOrAdmin(token);

  if (userOrAdmin) {
    if (userOrAdmin.user) {
      req.user = userOrAdmin.user;
    }
    if (userOrAdmin.admin) {
      req.admin = userOrAdmin.admin;
      req.isAdmin = userOrAdmin.isAdmin;
    }
    return next();
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
  });

  return res.status(401).json({ message: 'Not authorized, token failed' });
});

// Middleware to protect routes for admins only
const protectAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const userOrAdmin = await verifyTokenAndGetUserOrAdmin(token);

  if (userOrAdmin && userOrAdmin.admin) {
    req.admin = userOrAdmin.admin;
    req.isAdmin = true;
    return next();
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
  });

  return res.status(401).json({ message: 'Not authorized as admin' });
});

export { protect, protectAdmin };
