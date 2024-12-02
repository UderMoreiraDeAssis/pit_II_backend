// routes/notificationRoutes.js
const express = require('express');
const { sendEmail } = require('../services/emailService');
const { sendPushNotification } = require('../services/pushNotificationService');
const router = express.Router();

// Send Email Notification
router.post('/email', async (req, res) => {
  try {
    console.log('Received email notification request:', req.body);

    const { to, subject, text } = req.body;
    console.log('Parsed email data:', { to, subject, text });

    if (!to || !subject || !text) {
      console.error('Missing email fields. Request body:', req.body);
      return res.status(400).json({ error: 'All fields (to, subject, text) are required' });
    }

    console.log('Calling sendEmail with data:', { to, subject, text });
    await sendEmail({ to, subject, text });
    console.log('Email sent successfully to:', to);

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error while sending email:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Send Push Notification
router.post('/push', async (req, res) => {
  try {
    console.log('Received push notification request:', req.body);

    const { token, title, body } = req.body;
    console.log('Parsed push notification data:', { token, title, body });

    if (!token || !title || !body) {
      console.error('Missing push notification fields. Request body:', req.body);
      return res.status(400).json({ error: 'All fields (token, title, body) are required' });
    }

    console.log('Calling sendPushNotification with data:', { token, title, body });
    await sendPushNotification(token, title, body);
    console.log('Push notification sent successfully to token:', token);

    res.json({ message: 'Push notification sent successfully' });
  } catch (err) {
    console.error('Error while sending push notification:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
