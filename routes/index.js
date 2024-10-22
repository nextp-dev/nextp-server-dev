const express = require("express");
const authRoutes = require("./authRoutes"); // Auth routes (login, registration, change password)
const userRoutes = require("./userRoutes"); // User management routes
const companyRoutes = require("./companyRoutes"); // Company management routes
const notificationsRoutes = require("./notificationsRoutes");
const reportsRoutes = require("./reportsRoutes");
const transactionsRoutes = require("./transactionsRoutes");

const router = express.Router();

// Auth routes
router.use("/auth", authRoutes);

// User management routes
router.use("/users", userRoutes);

// Company management routes
router.use("/companies", companyRoutes);

//notification routes
router.use("/notifications", notificationsRoutes);

//reports related routes
router.use("/reports", reportsRoutes);

//transaction related routes
router.use("/transactions", transactionsRoutes);

// Default route (optional)
router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the NexTP API" });
});

module.exports = router;
