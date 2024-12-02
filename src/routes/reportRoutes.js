// routes/reportRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const TimeEntry = require('../models/TimeEntry');
const router = express.Router();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

router.get('/export-csv', async (req, res) => {
  try {
    console.log('Request received for exporting time entries as CSV');

    // Fetching time entries
    console.log('Fetching time entries from the database...');
    const timeEntries = await TimeEntry.find().populate(['user', 'task']);
    console.log(`Fetched ${timeEntries.length} time entries`);

    // Preparing CSV data
    console.log('Preparing data for CSV...');
    const csvData = timeEntries.map((entry) => {
      console.log('Processing time entry:', entry);
      return {
        User: entry.user?.name || 'Unknown User',
        Task: entry.task?.title || 'Unknown Task',
        Start_Time: entry.startTime,
        End_Time: entry.endTime,
        Duration: entry.duration,
      };
    });
    console.log('CSV data prepared:', csvData);

    // Setting up CSV writer
    const csvFilePath = path.resolve(__dirname, '../exports/time_entries.csv');
    console.log('CSV file will be created at:', csvFilePath);
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'User', title: 'User' },
        { id: 'Task', title: 'Task' },
        { id: 'Start_Time', title: 'Start_Time' },
        { id: 'End_Time', title: 'End_Time' },
        { id: 'Duration', title: 'Duration' },
      ],
    });

    // Writing data to CSV
    console.log('Writing data to CSV file...');
    await csvWriter.writeRecords(csvData);
    console.log('CSV file successfully created');

    // Sending the file to the client
    console.log('Sending CSV file to the client...');
    res.download(csvFilePath, 'time_entries.csv', (err) => {
      if (err) {
        console.error('Error during file download:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('File successfully downloaded by the client');

      // Removing the file after download
      console.log('Deleting the CSV file from the server...');
      fs.unlinkSync(csvFilePath);
      console.log('CSV file deleted successfully');
    });
  } catch (err) {
    console.error('Error during CSV export process:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
