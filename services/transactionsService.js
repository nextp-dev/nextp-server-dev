const db = require("../config/db");

exports.createTransaction = async (transactionData) => {
  const {
    company_id_from,
    company_id_to,
    transaction_type,
    amount,
    currency,
    financial_year,
    financial_month,
  } = transactionData;

  const query = `
    INSERT INTO transactions (company_id_from, company_id_to, transaction_type, amount, currency, financial_year, financial_month)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          company_id_from,
          company_id_to,
          transaction_type,
          amount,
          currency,
          financial_year,
          financial_month,
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    return { message: "Transaction created successfully" };
  } catch (error) {
    throw new Error(`Error creating transaction: ${error.message}`);
  }
};

exports.getTransactionsByCompanyId = async (companyId) => {
  const query = `
    SELECT * FROM transactions 
    WHERE company_id_from = ? OR company_id_to = ?
  `;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [companyId, companyId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return results;
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }
};

exports.updateTransaction = async (transactionId, updateData) => {
  const {
    company_id_from,
    company_id_to,
    transaction_type,
    amount,
    currency,
    financial_year,
    financial_month,
  } = updateData;

  const query = `
    UPDATE transactions 
    SET company_id_from = ?, company_id_to = ?, transaction_type = ?, amount = ?, currency = ?, financial_year = ?, financial_month = ?
    WHERE id = ?
  `;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          company_id_from,
          company_id_to,
          transaction_type,
          amount,
          currency,
          financial_year,
          financial_month,
          transactionId,
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    if (results.affectedRows === 0) {
      throw new Error("Transaction not found or no changes made");
    }

    return { message: "Transaction updated successfully" };
  } catch (error) {
    throw new Error(`Error updating transaction: ${error.message}`);
  }
};

exports.deleteTransaction = async (transactionId) => {
  const query = "DELETE FROM transactions WHERE id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [transactionId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (results.affectedRows === 0) {
      throw new Error("Transaction not found");
    }

    return { message: "Transaction deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting transaction: ${error.message}`);
  }
};
