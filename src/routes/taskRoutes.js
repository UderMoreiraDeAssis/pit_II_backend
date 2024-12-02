// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const router = express.Router();

// Create Task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('project assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project assignedTo');
    if (task) res.json(task);
    else res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedTask) res.json(updatedTask);
    else res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (deletedTask) res.json({ message: 'Task deleted' });
    else res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign Task to User
router.post('/:id/assign', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    task.assignedTo = user._id;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
