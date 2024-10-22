const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");

router.post("/", reportsController.createReport);
router.get("/:companyId", reportsController.getReportsByCompanyId);
router.put("/:reportId", reportsController.updateReport);
router.delete("/:reportId", reportsController.deleteReport);

module.exports = router;
