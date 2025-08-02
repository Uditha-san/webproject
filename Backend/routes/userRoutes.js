import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator'; // Import
import { login, register } from '../controllers/authController.js';
import {
  getUserData,
  storeRecentSearchCities
} from '../controllers/userController.js';

import { verifyEmail } from '../controllers/authController.js';

const userRouter = express.Router();

// Auth routes
userRouter.post('/register', [
    body('firstName').trim().isLength({ min: 2 }).escape(),
    body('lastName').trim().isLength({ min: 2 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ], register);
userRouter.post('/login', login);

// User routes (protected)
userRouter.get('/', protect(), getUserData);
userRouter.post('/store-recent-search', protect(), storeRecentSearchCities);

userRouter.get('/verify-email', verifyEmail);


export default userRouter;
