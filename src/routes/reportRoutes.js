// routes/reportRoutes.js
const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const TimeEntry = require('../models/TimeEntry');
const router = express.Router();

// Export Time Entries as CSV
router.get('/export-csv', async (req, res) => {
  try {
    const timeEntries = await TimeEntry.find().populate(['user', 'task']);

    const csvData = timeEntries.map((entry) => ({
      User: entry.user.name,
      Task: entry.task.title,
      Start_Time: entry.startTime,
      End_Time: entry.endTime,
      Duration: entry.duration,
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=time_entries.csv');

    const csvWriter = fs.createWriteStream(path.join(__dirname, '../exports/time_entries.csv'));
    csvWriter.write('User,Task,Start_Time,End_Time,Duration\n');

    csvData.forEach((row) => {
      csvWriter.write(`${row.User},${row.Task},${row.Start_Time},${row.End_Time},${row.Duration}\n`);
    });

    csvWriter.end();
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
