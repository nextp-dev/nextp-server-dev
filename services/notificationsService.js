// services/notificationsService.js
const db = require("../config/db");

exports.createNotification = async (notificationData) => {
  const { company_id, message } = notificationData;

  const query = `
    INSERT INTO notifications (company_id, message)
    VALUES (?, ?)
  `;

  try {
    await new Promise((resolve, reject) => {
      db.query(query, [company_id, message], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return { message: "Notification created successfully" };
  } catch (error) {
    throw new Error(`Error creating notification: ${error.message}`);
  }
};

exports.getNotificationsByCompanyId = async (companyId) => {
  const query = "SELECT * FROM notifications WHERE company_id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [companyId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return results;
  } catch (error) {
    throw new Error(`Error fetching notifications: ${error.message}`);
  }
};

exports.markNotificationAsRead = async (notificationId) => {
  const query = "UPDATE notifications SET is_read = TRUE WHERE id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [notificationId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return { message: "Notification marked as read" };
  } catch (error) {
    throw new Error(`Error marking notification as read: ${error.message}`);
  }
};

exports.markNotificationAsUnread = async (notificationId) => {
  const query = "UPDATE notifications SET is_read = FALSE WHERE id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [notificationId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return { message: "Notification marked as unread" };
  } catch (error) {
    throw new Error(`Error marking notification as read: ${error.message}`);
  }
};
