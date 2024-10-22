const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.register = async (req, res) => {
  const { email, password, role, first_name, last_name, company_name, phone_no } =
    req.body;

  try {
    // Check if the company exists
    const checkCompanyQuery = "SELECT id FROM companies WHERE name = ?";
    db.query(checkCompanyQuery, [company_name], async (err, companyResults) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (companyResults.length === 0) {
        return res.status(400).json({ message: "Company does not exist" });
      }

      let company_id = companyResults[0].id;

      // Check if the user already exists
      const checkUserQuery = "SELECT * FROM users WHERE email = ?";
      db.query(checkUserQuery, [email], async (err, userResults) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (userResults.length > 0) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Start a transaction
        db.beginTransaction((err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Database transaction error" });

          // Insert into users table
          const userQuery =
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
          db.query(userQuery, [email, hashedPassword, role], (err, results) => {
            if (err) {
              db.rollback(() =>
                res
                  .status(500)
                  .json({ message: "Database error during user registration" })
              );
              return;
            }

            // Insert into user_details table
            const detailsQuery =
              "INSERT INTO user_details (user_email, first_name, last_name, company_id, phone_no) VALUES (?, ?, ?, ?, ?)";
            db.query(
              detailsQuery,
              [email, first_name, last_name, company_id, phone_no],
              (err, results) => {
                if (err) {
                  db.rollback(() => {
                    res.status(500).json({
                      message:
                        "Database error during user details registration",
                    });
                  });
                  return;
                }

                // Commit the transaction
                db.commit((err) => {
                  if (err) {
                    db.rollback(() =>
                      res.status(500).json({ message: "Database commit error" })
                    );
                    return;
                  }
                  res
                    .status(201)
                    .json({ message: "User registered successfully" });
                });
              }
            );
          });
        });
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query to get the user by email
    const userQuery = "SELECT * FROM users WHERE email = ?";
    const userResults = await new Promise((resolve, reject) => {
      db.query(userQuery, [email], (err, results) => {
        if (err) {
          return reject(new Error("Database error"));
        }
        if (results.length === 0) {
          return reject(new Error("Invalid credentials"));
        }
        resolve(results[0]);
      });
    });

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, userResults.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Query to get the user details by email
    const detailsQuery = "SELECT * FROM user_details WHERE user_email = ?";
    const detailsResults = await new Promise((resolve, reject) => {
      db.query(detailsQuery, [email], (err, results) => {
        if (err) {
          return reject(new Error("Database error"));
        }
        if (results.length === 0) {
          return reject(new Error("User details not found"));
        }
        resolve(results[0]);
      });
    });

    // If successful, return a success message and user info
    return res.status(200).json({
      message: "Login successful",
      user: {
        email: userResults.email,
        role: userResults.role,
        company_id: detailsResults.company_id,
      },
    });
  } catch (err) {
    // Handle errors properly
    return res.status(500).json({ message: err.message });
  }
};
exports.changePassword = async (req, res) => {
  const { email, current_password, new_password } = req.body;

  if (!email || !current_password || !new_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const query = "SELECT password FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const storedPassword = results[0].password;

      // Compare the current password with the stored hashed password
      const isMatch = await bcrypt.compare(current_password, storedPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update the password in the database
      const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
      db.query(updateQuery, [hashedPassword, email], (updateErr) => {
        if (updateErr) {
          return res
            .status(500)
            .json({ message: "Database error", error: updateErr });
        }
        return res
          .status(200)
          .json({ message: "Password changed successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
