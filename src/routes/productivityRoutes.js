// routes/productivityRoutes.js
const express = require('express');
const TimeEntry = require('../models/TimeEntry');
const router = express.Router();

// Get Productivity Data by User
router.get('/user/:userId', async (req, res) => {
  try {
    const timeEntries = await TimeEntry.find({ user: req.params.userId }).populate('task').populate('user');

    const productivityData = timeEntries.reduce((acc, entry) => {
      const date = entry.startTime.toDateString();
      acc[date] = (acc[date] || 0) + entry.duration;
      return acc;
    }, {});

    res.json(productivityData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Productivity Data by Project
router.get('/project/:projectId', async (req, res) => {
  try {
    const timeEntries = await TimeEntry.find({ task: { $in: await Task.find({ project: req.params.projectId }).select('_id') } })
      .populate('task')
      .populate('user');

    const productivityData = timeEntries.reduce((acc, entry) => {
      const date = entry.startTime.toDateString();
      acc[date] = (acc[date] || 0) + entry.duration;
      return acc;
    }, {});

    res.json(productivityData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
