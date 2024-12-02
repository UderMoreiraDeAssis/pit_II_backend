const express = require('express');
const User = require('../models/User');
const mongoose = require('mongoose'); // Importa o mongoose para verificar a conexão
const { hashPassword, generateToken, comparePassword } = require('../services/authService');
const router = express.Router();

// Validação de entrada
const validateRegistrationData = (data) => {
  const { name, email, password } = data;
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
// User registration without manual hashing
router.post('/register', async (req, res) => {
  try {
    validateRegistrationData(req.body);
    const { name, email, password } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Create user with plain password
    const user = new User({ name, email, password });
    await user.save();

    // Retrieve and log the hashed password from the database
    const userSalvo = await User.findOne({ email: email }).select('password');
    console.log('Retrieved hashed password:', userSalvo.password);

    // Generate and return JWT token
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint de Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and return JWT token
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

module.exports = router;
