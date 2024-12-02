// routes/productivityRoutes.js
const express = require('express');
const TimeEntry = require('../models/TimeEntry');
const Task = require('../models/Task'); // Certifique-se de que o modelo de Task está importado
const router = express.Router();

// Get Productivity Data by User
router.get('/user/:userId', async (req, res) => {
  try {
    console.log('Received request for productivity data by user:', req.params.userId);

    console.log('Fetching time entries for user:', req.params.userId);
    const timeEntries = await TimeEntry.find({ user: req.params.userId }).populate('task').populate('user');
    console.log('Time entries fetched:', timeEntries);

    console.log('Processing productivity data...');
    const productivityData = timeEntries.reduce((acc, entry) => {
      const date = entry.startTime.toDateString();
      acc[date] = (acc[date] || 0) + entry.duration;
      return acc;
    }, {});
    console.log('Processed productivity data:', productivityData);

    res.json(productivityData);
  } catch (err) {
    console.error('Error fetching productivity data by user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Productivity Data by Project
router.get('/project/:projectId', async (req, res) => {
  try {
    console.log('Received request for productivity data by project:', req.params.projectId);

    console.log('Fetching tasks for project:', req.params.projectId);
    const tasks = await Task.find({ project: req.params.projectId }).select('_id');
    console.log('Tasks fetched:', tasks);

    console.log('Fetching time entries for project tasks...');
    const timeEntries = await TimeEntry.find({ task: { $in: tasks.map((task) => task._id) } })
      .populate('task')
      .populate('user');
    console.log('Time entries fetched:', timeEntries);

    console.log('Processing productivity data...');
    const productivityData = timeEntries.reduce((acc, entry) => {
      const date = entry.startTime.toDateString();
      acc[date] = (acc[date] || 0) + entry.duration;
      return acc;
    }, {});
    console.log('Processed productivity data:', productivityData);

    res.json(productivityData);
  } catch (err) {
    console.error('Error fetching productivity data by project:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
