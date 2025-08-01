import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserData,
  storeRecentSearchCities
} from '../controllers/userController.js';
import {
  login,
  register
} from '../controllers/authController.js';

const userRouter = express.Router();

// Auth routes
userRouter.post('/register', register);
userRouter.post('/login', login);

// User routes (protected)
userRouter.get('/', protect(), getUserData);
userRouter.post('/store-recent-search', protect(), storeRecentSearchCities);


export default userRouter;
