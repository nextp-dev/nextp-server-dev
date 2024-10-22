const db = require("../config/db");

exports.createUser = async (userData) => {
  const { email, password, role, first_name, last_name, company_id, phone_no } =
    userData;

  console.log(
    email,
    password,
    role,
    first_name,
    last_name,
    company_id,
    phone_no
  );

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

exports.getUserById = async (userId) => {
  const query = `
    SELECT ud.*, u.email, u.role
    FROM user_details ud
    INNER JOIN users u ON ud.user_email = u.email
    WHERE ud.company_id = ? and ud.active = 1
  `;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [userId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (results.length === 0) {
      throw new Error("User not found");
    }

    return results;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

exports.updateUser = async (userId, updateData) => {
  const { first_name, last_name, phone_no, company_id, role, email } =
    updateData;

  const query = `
    UPDATE user_details 
    SET first_name = ?, last_name = ?, phone_no = ?, company_id = ?
    WHERE user_email = ?
  `;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        query,
        [first_name, last_name, phone_no, company_id, email],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    if (results.affectedRows === 0) {
      throw new Error("User not found or no changes made");
    }

    // Optionally, update the role in the users table if necessary
    const updateRoleQuery = "UPDATE users SET role = ? WHERE email = ?";
    await new Promise((resolve, reject) => {
      db.query(updateRoleQuery, [role, email], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return { message: "User updated successfully" };
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

exports.deleteUser = async (email) => {
  console.log(email);
  const deactivateQuery = `
    UPDATE users 
    SET active = 0, deactivated_on = NOW() 
    WHERE email = ? and active = 1
  `;

  const deactivateDetailsQuery = `
    UPDATE user_details 
    SET active = 0, deactivated_on = NOW() 
    WHERE user_email = ? and active = 1
  `;

  try {
    // Deactivate user in the `users` table
    const userResult = await new Promise((resolve, reject) => {
      db.query(deactivateQuery, [email], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    // Deactivate user in the `user_details` table
    const userDetailsResult = await new Promise((resolve, reject) => {
      db.query(deactivateDetailsQuery, [email], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (userResult.affectedRows === 0 && userDetailsResult.affectedRows === 0) {
      throw new Error("User not found or already deactivated");
    }

    return { message: "User deactivated successfully" };
  } catch (error) {
    throw new Error(`Error deactivating user: ${error.message}`);
  }
};

exports.getAllUsers = async () => {
  const query = `
    SELECT ud.*, u.email, u.role
    FROM user_details ud
    INNER JOIN users u ON ud.user_email = u.email
  `;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return results;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};
