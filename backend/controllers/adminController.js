import Admin from '../models/Admin.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

export const loginAdmin = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const admin = await Admin.findOne({ isActive: true });

  if (!admin || !(await admin.matchCode(code))) {
    res.status(401);
    throw new Error('Invalid admin code');
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = jwt.sign(
    { 
      id: admin._id,
      name: admin.name,
      role: admin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  const responseData = {
    _id: admin._id,
    name: admin.name,
    role: admin.role,
    isActive: admin.isActive,
    lastLogin: admin.lastLogin,
    isAdmin: true,
    token
  };

  res.status(200).json(responseData);
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-adminCode');
  
  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  res.status(200).json({
    _id: admin._id,
    name: admin.name,
    role: admin.role,
    isActive: admin.isActive,
    lastLogin: admin.lastLogin
  });
});

export const updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  admin.name = req.body.name || admin.name;
  
  if (req.body.adminCode) {
    if (req.body.adminCode.length !== 5) {
      res.status(400);
      throw new Error('Admin code must be exactly 5 characters');
    }
    admin.adminCode = req.body.adminCode;
  }

  const updatedAdmin = await admin.save();

  res.status(200).json({
    _id: updatedAdmin._id,
    name: updatedAdmin.name,
    role: updatedAdmin.role,
    isActive: updatedAdmin.isActive,
    lastLogin: updatedAdmin.lastLogin
  });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, adminCode } = req.body;

  if (!name || !adminCode) {
    res.status(400);
    throw new Error('Please provide both name and admin code');
  }

  if (adminCode.length !== 5) {
    res.status(400);
    throw new Error('Admin code must be exactly 5 characters');
  }

  const adminExists = await Admin.findOne({ adminCode });
  if (adminExists) {
    res.status(400);
    throw new Error('This admin code is already in use');
  }

  const admin = await Admin.create({
    name,
    adminCode,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive
    });
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});