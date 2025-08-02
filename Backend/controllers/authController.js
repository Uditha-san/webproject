import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';



// Register
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;
  const username = `${firstName} ${lastName}`; // Create username from first and last name

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Required fields are missing' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      // ADDED: Save new fields to the database
      phone,
      dateOfBirth,
    });

    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.blockUntil && user.blockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.blockUntil - Date.now()) / (1000 * 60 * 60));
      return res.status(423).json({ 
        success: false, 
        message: `Account is locked due to too many failed login attempts. Try again in ${remainingTime} hours.`,
        isLocked: true,
        remainingTime: remainingTime
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      // Reload user to get updated attempt count
      const updatedUser = await User.findById(user._id);
      
      // Check if account is now locked
      if (updatedUser.blockUntil && updatedUser.blockUntil > Date.now()) {
        return res.status(423).json({ 
          success: false, 
          message: 'Too many failed login attempts. Account locked for 24 hours.',
          isLocked: true,
          remainingTime: 24
        });
      }
      
      const attemptsLeft = 5 - updatedUser.loginAttempts;
      return res.status(401).json({ 
        success: false, 
        message: `Invalid credentials. ${attemptsLeft} attempts remaining before account lockout.`,
        attemptsLeft: attemptsLeft
      });
    }

    // Successful login - reset login attempts
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
