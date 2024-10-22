const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

var connection = mysql.createConnection({
  host: "nextp-dev.mysql.database.azure.com",
  user: "nextpadmin",
  password: "Wtt2pBtcbda6RB2",
  database: "nextp-dev-database",
  port: 3306,
  ssl: false,
});

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl: false,
// });

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
    return;
  }
  console.log("Connected to database");
});

module.exports = connection;
