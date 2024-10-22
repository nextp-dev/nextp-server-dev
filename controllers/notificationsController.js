// controllers/notificationsController.js
const notificationsService = require("../services/notificationsService");

exports.createNotification = async (req, res) => {
  try {
    const response = await notificationsService.createNotification(req.body);
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getNotificationsByCompanyId = async (req, res) => {
  try {
    const notifications =
      await notificationsService.getNotificationsByCompanyId(
        req.params.companyId
      );
    res.status(200).json(notifications);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const response = await notificationsService.markNotificationAsRead(
      req.params.id
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.markNotificationAsUnread = async (req, res) => {
  try {
    const response = await notificationsService.markNotificationAsUnread(
      req.params.id
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
