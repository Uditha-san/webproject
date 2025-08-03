import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import transporter from '../configs/nodemailer.js'; // Make sure this path is correct

// Register
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;
  const username = `${firstName} ${lastName}`;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Generate verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 3600000; // 1 hour from now

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await newUser.save();

    // 2. Send verification email
    const verificationUrl = `http://localhost:5173/verify-email?token=${emailVerificationToken}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: newUser.email,
      subject: 'Verify Your Email for IM-Hotel Booking',
      html: `
        <h2>Welcome to the platform!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in one hour.</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    
    // 3. Respond to user
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
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

    // Check if email is verified
    if (!user.isVerified) {
        return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
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
      await user.incLoginAttempts();
      const updatedUser = await User.findById(user._id);
      
      if (updatedUser.blockUntil && updatedUser.blockUntil > Date.now()) {
        return res.status(423).json({ 
          success: false, 
          message: 'Too many failed login attempts. Account locked for 24 hours.',
          isLocked: true,
          remainingTime: 24
        });
      }
      
      const attemptsLeft = 5 - (updatedUser.loginAttempts || 0);
      return res.status(401).json({ 
        success: false, 
        message: `Invalid credentials. ${attemptsLeft} attempts remaining before account lockout.`,
        attemptsLeft: attemptsLeft
      });
    }

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

// Verify Email
export const verifyEmail = async (req, res) => {
    try {
      const { token } = req.body;
  
      if (!token) {
          return res.status(400).json({ success: false, message: 'Verification token is missing.' });
      }
  
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
      }
  
      user.isVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
  
      res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
  
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};