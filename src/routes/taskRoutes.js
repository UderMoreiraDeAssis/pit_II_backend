// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User'); // Adicionado o modelo de User
const router = express.Router();

// Create Task
router.post('/', async (req, res) => {
  console.log('Request to create a task:', req.body);
  try {
    const task = new Task(req.body);
    await task.save();
    console.log('Task created successfully:', task);
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get All Tasks
router.get('/', async (req, res) => {
  console.log('Request to get all tasks');
  try {
    const tasks = await Task.find().populate('project').populate('assignedTo');
    console.log('Tasks retrieved successfully:', tasks);
    res.json(tasks);
  } catch (err) {
    console.error('Error retrieving tasks:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Task by ID
router.get('/:id', async (req, res) => {
  console.log(`Request to get task by ID: ${req.params.id}`);
  try {
    const task = await Task.findById(req.params.id).populate('project').populate('assignedTo');
    if (task) {
      console.log('Task retrieved successfully:', task);
      res.json(task);
    } else {
      console.warn('Task not found:', req.params.id);
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    console.error('Error retrieving task by ID:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put('/:id', async (req, res) => {
  console.log(`Request to update task by ID: ${req.params.id}`, req.body);
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedTask) {
      console.log('Task updated successfully:', updatedTask);
      res.json(updatedTask);
    } else {
      console.warn('Task not found for update:', req.params.id);
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  console.log(`Request to delete task by ID: ${req.params.id}`);
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (deletedTask) {
      console.log('Task deleted successfully:', deletedTask);
      res.json({ message: 'Task deleted' });
    } else {
      console.warn('Task not found for deletion:', req.params.id);
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Assign Task to User
router.post('/:id/assign', async (req, res) => {
  console.log(`Request to assign task ID: ${req.params.id} to user ID: ${req.body.userId}`);
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      console.warn('Task not found for assignment:', req.params.id);
      return res.status(404).json({ error: 'Task not found' });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      console.warn('User not found for assignment:', req.body.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    task.assignedTo = user._id;
    await task.save();
    console.log('Task assigned successfully:', task);
    res.json(task);
  } catch (err) {
    console.error('Error assigning task:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
