import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

// @desc    Get user or admin profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  let user;
  
  // Check if it's a user or admin
  if (req.user) {
    user = await User.findById(req.user._id).select('-password');
  } else if (req.admin) {
    // If it's an admin, fetch admin details
    user = await Admin.findById(req.admin._id).select('-adminCode');
  }

  if (!user) {
    res.status(404);
    throw new Error('User or Admin not found');
  }

  res.status(200).json(user);
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, user: username, phone, password } = req.body;

  if (!name || !username || !phone || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user already exists
  const [userExists, phoneExists] = await Promise.all([
    User.findOne({ user: username }),
    User.findOne({ phone })
  ]);

  if (userExists) {
    res.status(400);
    throw new Error('Username is already taken');
  }

  if (phoneExists) {
    res.status(400);
    throw new Error('Phone number is already registered');
  }

  // Create new user
  const newUser = await User.create({
    name,
    user: username,
    phone,
    password
  });

  if (newUser) {
    // Generate token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      user: newUser.user,
      phone: newUser.phone
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { user: userInput, password } = req.body;

  if (!userInput || !password) {
    res.status(400);
    throw new Error('Please provide both username/phone and password');
  }

  // Find user by username or phone
  const user = await User.findOne({
    $or: [
      { user: userInput },
      { phone: userInput }
    ]
  });

  if (!user) {
    res.status(401);
    throw new Error('Invalid username/phone or password');
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid username/phone or password');
  }

  // Generate token and set cookie
  generateTokenAndSetCookie(user._id, res);

  res.json({
    _id: user._id,
    name: user.name,
    user: user.user,
    phone: user.phone
  });
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

// @desc    Get current user profile
// @route   GET /api/users/user
// @access  Private
export const getUser = asyncHandler(async (req, res) => {
  let userData;

  if (req?.admin) {
    const admin = await Admin.findById(req.admin._id).select('-adminCode');
    
    if (!admin) {
      res.status(404);
      throw new Error('Admin not found');
    }
    
    userData = admin;
  } else {
    const user = await User.findById(req?.user?._id).select('-password');
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    userData = user;
  }

  res.status(200).json({
    success: true,
    user: userData
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields if provided
  user.name = req.body.name || user.name;
  user.user = req.body.user || user.user;
  user.phone = req.body.phone || user.phone;
  
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    user: updatedUser.user,
    phone: updatedUser.phone
  });
});

// @desc    Delete user
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUserProfile,
  deleteUser,
  getUserProfile
};
