const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/db");
const cors = require("cors");
const routes = require("./routes"); // Import the centralized routes file

dotenv.config();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: "GET, POST, PUT, DELETE",
    credentials: true, // Allow cookies to be sent with the requests
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Test database connection route
app.get("/api/test-db", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query failed: ", err);
      return res
        .status(500)
        .json({ message: "Database query failed", error: err });
    }
    res.status(200).json({
      message: "Database connection successful",
      count: results[0].count,
    });
  });
});

// Use the centralized routes
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
