const express = require('express');
const TimeEntry = require('../models/TimeEntry');
const User = require('../models/User');
const Task = require('../models/Task');
const router = express.Router();

// Create a new time entry
router.post('/', async (req, res) => {
  try {
    const timeEntry = new TimeEntry(req.body);
    await timeEntry.save();
    res.status(201).json(timeEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all time entries
router.get('/', async (req, res) => {
  try {
    const timeEntries = await TimeEntry.find().populate('user task');
    res.json(timeEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific time entry by ID
router.get('/:id', async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findById(req.params.id).populate('user task');
    if (timeEntry) {
      res.json(timeEntry);
    } else {
      res.status(404).json({ error: 'Time entry not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a time entry by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTimeEntry = await TimeEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedTimeEntry) {
      res.json(updatedTimeEntry);
    } else {
      res.status(404).json({ error: 'Time entry not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a time entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedTimeEntry = await TimeEntry.findByIdAndDelete(req.params.id);
    if (deletedTimeEntry) {
      res.json({ message: 'Time entry deleted' });
    } else {
      res.status(404).json({ error: 'Time entry not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all time entries for a specific user
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const timeEntries = await TimeEntry.find({ user: req.params.userId }).populate('task');
    res.json(timeEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all time entries for a specific task
router.get('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const timeEntries = await TimeEntry.find({ task: req.params.taskId }).populate('user');
    res.json(timeEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
