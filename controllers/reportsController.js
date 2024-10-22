const reportsService = require("../services/reportsService");

exports.createReport = async (req, res) => {
  try {
    const response = await reportsService.createReport(req.body);
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getReportsByCompanyId = async (req, res) => {
  try {
    const reports = await reportsService.getReportsByCompanyId(
      req.params.companyId
    );
    res.status(200).json(reports);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const response = await reportsService.updateReport(
      req.params.reportId,
      req.body
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const response = await reportsService.deleteReport(req.params.reportId);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
