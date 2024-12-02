const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Create User
router.post('/', async (req, res) => {
  console.log('Request received to create a new user:', req.body);
  try {
    const user = new User(req.body);
    await user.save();
    console.log('User created successfully:', user);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get All Users
router.get('/', async (req, res) => {
  console.log('Request received to get all users');
  try {
    const users = await User.find();
    console.log('Users retrieved successfully:', users);
    res.json(users);
  } catch (err) {
    console.error('Error retrieving users:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get User by ID
router.get('/:id', async (req, res) => {
  console.log(`Request received to get user by ID: ${req.params.id}`);
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      console.log('User retrieved successfully:', user);
      res.json(user);
    } else {
      console.warn('User not found with ID:', req.params.id);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error retrieving user by ID:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update User
router.put('/:id', async (req, res) => {
  console.log(`Request received to update user by ID: ${req.params.id}`, req.body);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Retorna o documento atualizado
    );
    if (updatedUser) {
      console.log('User updated successfully:', updatedUser);
      res.json(updatedUser);
    } else {
      console.warn('User not found for update with ID:', req.params.id);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  console.log(`Request received to delete user by ID: ${req.params.id}`);
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      console.log('User deleted successfully:', deletedUser);
      res.json({ message: 'User deleted' });
    } else {
      console.warn('User not found for deletion with ID:', req.params.id);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
