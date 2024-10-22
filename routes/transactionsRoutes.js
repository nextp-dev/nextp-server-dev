const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionsController");

router.post("/", transactionController.createTransaction);
router.get("/:companyId", transactionController.getTransactionsByCompanyId);
router.put("/:transactionId", transactionController.updateTransaction);
router.delete("/:transactionId", transactionController.deleteTransaction);

module.exports = router;
