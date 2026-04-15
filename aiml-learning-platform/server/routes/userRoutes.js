import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProgress,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateProgress);

export default router;