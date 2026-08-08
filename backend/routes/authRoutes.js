import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfileImage, handleMulterError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  handleMulterError(uploadProfileImage),
  updateProfile
);
router.put('/change-password', protect, changePassword);

export default router;
