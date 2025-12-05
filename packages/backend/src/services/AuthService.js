const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

class AuthService {
  static async register(email, username, business_name, password) {
    // Validate input
    if (!email || !username || !business_name || !password) {
      throw new Error('Email, username, business_name, and password are required');
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create(email, username, business_name, passwordHash);
    return newUser;
  }

  static async login(email, password) {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      SECRET_KEY,
      { expiresIn: JWT_EXPIRY }
    );

    return { 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        business_name: user.business_name
      } 
    };
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = AuthService;
