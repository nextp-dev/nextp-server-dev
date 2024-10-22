// routes/notificationsRoutes.js
const express = require("express");
const notificationsController = require("../controllers/notificationsController");

const router = express.Router();

router.post("/", notificationsController.createNotification);
router.get("/:companyId", notificationsController.getNotificationsByCompanyId);
router.put("/:id/read", notificationsController.markNotificationAsRead);
router.put("/:id/unread", notificationsController.markNotificationAsUnread);

module.exports = router;
