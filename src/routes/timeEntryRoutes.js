const express = require('express');
const TimeEntry = require('../models/TimeEntry');
const User = require('../models/User');
const Task = require('../models/Task');
const router = express.Router();

// Create a new time entry
router.post('/', async (req, res) => {
  console.log('Request to create a new time entry:', req.body);
  try {
    const timeEntry = new TimeEntry(req.body);
    await timeEntry.save();
    console.log('Time entry created successfully:', timeEntry);
    res.status(201).json(timeEntry);
  } catch (err) {
    console.error('Error creating time entry:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get all time entries
router.get('/', async (req, res) => {
  console.log('Request to get all time entries');
  try {
    const timeEntries = await TimeEntry.find().populate('user task');
    console.log('Time entries retrieved successfully:', timeEntries);
    res.json(timeEntries);
  } catch (err) {
    console.error('Error retrieving time entries:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get a specific time entry by ID
router.get('/:id', async (req, res) => {
  console.log(`Request to get time entry by ID: ${req.params.id}`);
  try {
    const timeEntry = await TimeEntry.findById(req.params.id).populate('user task');
    if (timeEntry) {
      console.log('Time entry retrieved successfully:', timeEntry);
      res.json(timeEntry);
    } else {
      console.warn('Time entry not found:', req.params.id);
      res.status(404).json({ error: 'Time entry not found' });
    }
  } catch (err) {
    console.error('Error retrieving time entry by ID:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update a time entry by ID
router.put('/:id', async (req, res) => {
  console.log(`Request to update time entry by ID: ${req.params.id}`, req.body);
  try {
    const updatedTimeEntry = await TimeEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedTimeEntry) {
      console.log('Time entry updated successfully:', updatedTimeEntry);
      res.json(updatedTimeEntry);
    } else {
      console.warn('Time entry not found for update:', req.params.id);
      res.status(404).json({ error: 'Time entry not found' });
    }
  } catch (err) {
    console.error('Error updating time entry:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Delete a time entry by ID
router.delete('/:id', async (req, res) => {
  console.log(`Request to delete time entry by ID: ${req.params.id}`);
  try {
    const deletedTimeEntry = await TimeEntry.findByIdAndDelete(req.params.id);
    if (deletedTimeEntry) {
      console.log('Time entry deleted successfully:', deletedTimeEntry);
      res.json({ message: 'Time entry deleted' });
    } else {
      console.warn('Time entry not found for deletion:', req.params.id);
      res.status(404).json({ error: 'Time entry not found' });
    }
  } catch (err) {
    console.error('Error deleting time entry:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all time entries for a specific user
router.get('/users/:userId', async (req, res) => {
  console.log(`Request to get time entries for user ID: ${req.params.userId}`);
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.warn('User not found:', req.params.userId);
      return res.status(404).json({ error: 'User not found' });
    }
    const timeEntries = await TimeEntry.find({ user: req.params.userId }).populate('task');
    console.log('Time entries for user retrieved successfully:', timeEntries);
    res.json(timeEntries);
  } catch (err) {
    console.error('Error retrieving time entries for user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all time entries for a specific task
router.get('/tasks/:taskId', async (req, res) => {
  console.log(`Request to get time entries for task ID: ${req.params.taskId}`);
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      console.warn('Task not found:', req.params.taskId);
      return res.status(404).json({ error: 'Task not found' });
    }
    const timeEntries = await TimeEntry.find({ task: req.params.taskId }).populate('user');
    console.log('Time entries for task retrieved successfully:', timeEntries);
    res.json(timeEntries);
  } catch (err) {
    console.error('Error retrieving time entries for task:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
