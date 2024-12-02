const express = require('express');
const User = require('../models/User');
const mongoose = require('mongoose');
const { hashPassword, generateToken, comparePassword } = require('../services/authService');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Endpoint para obter os dados do usuário logado
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// Validação de entrada
const validateRegistrationData = (data) => {
  const { name, email, password } = data;
  console.log('Validating registration data:', data);
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    throw new Error('Name must be at least 3 characters long');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
};

// User Registration
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    validateRegistrationData(req.body);

    const { name, email, password } = req.body;
    console.log('Validated data:', { name, email });

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Create user with plain password
    const user = new User({ name, email, password });
    console.log('Creating user:', user);
    await user.save();
    console.log('User successfully created:', user);

    // Retrieve and log the hashed password from the database
    const userSalvo = await User.findOne({ email: email }).select('password');
    console.log('Retrieved hashed password from DB:', userSalvo.password);

    // Generate and return JWT token
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();
    console.log('User registered successfully:', userWithoutPassword);
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Endpoint de Login
router.post('/login', async (req, res) => {
  try {
    console.log('Received login request:', req.body);

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('Invalid credentials - user not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('User found for login:', user);

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    console.log('Password comparison result:', isMatch);
    if (!isMatch) {
      console.log('Invalid credentials - password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and return JWT token
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();
    console.log('Login successful. Generating token for user:', userWithoutPassword);
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

module.exports = router;
