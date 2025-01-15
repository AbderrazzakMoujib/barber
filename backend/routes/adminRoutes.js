import express from 'express';
import { 
  loginAdmin, 
  logoutAdmin,
  createAdmin,
  getAdminProfile,
  updateAdminProfile
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', protectAdmin, logoutAdmin);
router.post('/create', createAdmin);
router.get('/me', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);

export default router;