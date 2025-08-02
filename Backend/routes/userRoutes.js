import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserData,
  storeRecentSearchCities
} from '../controllers/userController.js';

import {
  login,
  register,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController.js';

const userRouter = express.Router();

// Auth routes
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/verify-email', verifyEmail);

// User routes (protected)
userRouter.get('/', protect(), getUserData);
userRouter.post('/store-recent-search', protect(), storeRecentSearchCities);

// Password reset routes
userRouter.post('/forgot-password', requestPasswordReset);
userRouter.post('/reset-password', resetPassword);

export default userRouter;
