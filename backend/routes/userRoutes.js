import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Corrected import
import {
  registerUser,
  loginUser,
  getUser,
  getUserProfile,
  logoutUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
// router.get('/user', protect, getUser);  // This route gets the current user's data

// Add this new route specifically for getting current user
router.get('/user', protect, getUser);

export default router;
