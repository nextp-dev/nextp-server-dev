const sql = require("mssql");

// Configuration object
const config = {
  user: "nextp-dev",
  password: "Tu#9nb@T%EAdqWCH",
  server: "nextp-dev.database.windows.net",
  database: "nextp-database-dev",
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  },
};

// Global pool connection
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to Azure SQL Database");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed!", err);
    process.exit(1);
  });

// Query function using the connection pool
async function executeQuery(query) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
  }
}

// Example usage of the executeQuery function
executeQuery("SELECT TOP 1 * FROM companies").then((result) => {
  console.log(result);
});
