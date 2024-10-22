const transactionService = require("../services/transactionsService");

exports.createTransaction = async (req, res) => {
  try {
    const response = await transactionService.createTransaction(req.body);
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTransactionsByCompanyId = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByCompanyId(
      req.params.companyId
    );
    res.status(200).json(transactions);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const response = await transactionService.updateTransaction(
      req.params.transactionId,
      req.body
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const response = await transactionService.deleteTransaction(
      req.params.transactionId
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
