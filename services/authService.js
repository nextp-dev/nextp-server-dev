// services/authService.js
const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.registerUser = async (userData) => {
  const { email, password, role, first_name, last_name, company_id, phone_no } =
    userData;

  try {
    // Check if the user already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUser] = await db.query(checkUserQuery, [email]);

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user and user details into a transaction
    await db.beginTransaction();

    const userQuery =
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
    const [userResult] = await db.query(userQuery, [
      email,
      hashedPassword,
      role,
    ]);

    const detailsQuery =
      "INSERT INTO user_details (user_id, user_email, first_name, last_name, phone_no, company_id) VALUES (?, ?, ?, ?, ?)";
    await db.query(detailsQuery, [
      userResult.insertId,
      email,
      first_name,
      last_name,
      phone_no,
      company_id,
    ]);

    await db.commit();
    return { message: "User registered successfully" };
  } catch (err) {
    await db.rollback();
    throw err;
  }
};

exports.loginUser = async (email, password) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const [users] = await db.query(query, [email]);

  if (users.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    company_id: user.company_id,
  };
};

exports.changePassword = async (email, current_password, new_password) => {
  const query = "SELECT password FROM users WHERE email = ?";
  const [users] = await db.query(query, [email]);

  if (users.length === 0) {
    throw new Error("User not found");
  }

  const storedPassword = users[0].password;
  const isMatch = await bcrypt.compare(current_password, storedPassword);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);
  const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
  await db.query(updateQuery, [hashedPassword, email]);

  return { message: "Password changed successfully" };
};
