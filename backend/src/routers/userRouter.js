import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from '../controllers/userController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers).post(registerUser);

router.post('/logout', protect, logoutUser);

router.post('/login', authUser);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserById)
  .delete(protect, admin, deleteUserById);

export default router;
