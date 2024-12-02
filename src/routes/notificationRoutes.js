// routes/notificationRoutes.js
const express = require('express');
const { sendEmail } = require('../services/emailService');
const { sendPushNotification } = require('../services/pushNotificationService');
const router = express.Router();

// Send Email Notification
router.post('/email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await sendEmail({ to, subject, text });
    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send Push Notification
router.post('/push', async (req, res) => {
  try {
    const { token, title, body } = req.body;
    await sendPushNotification(token, title, body);
    res.json({ message: 'Push notification sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
