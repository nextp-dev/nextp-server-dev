const companyService = require("../services/companyService");

exports.createCompany = async (req, res) => {
  try {
    const response = await companyService.createCompany(req.body);
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.status(200).json(company);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const response = await companyService.updateCompany(
      req.params.id,
      req.body
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const response = await companyService.deleteCompany(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json(companies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getCompanyWithRelations = async (req, res) => {
  try {
    const result = await companyService.getCompanyWithRelations(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
