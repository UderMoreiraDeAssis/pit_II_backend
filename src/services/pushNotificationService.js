// services/pushNotificationService.js
const FCM = require('fcm-node');
const fcm = new FCM(process.env.FCM_SERVER_KEY);



module.exports = {
  sendPushNotification: async (token, title, body) => {
    const message = {
      to: token,
      notification: {
        title: title,
        body: body,
      },
    };

    return await fcm.send(message);
  },
};
