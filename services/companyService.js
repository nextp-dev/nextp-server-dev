const db = require("../config/db");

exports.createCompany = async (companyData) => {
  const { name, address, country, tax_id, vat_id } = companyData;

  const query =
    "INSERT INTO companies (name, address, country, tax_id, vat_id) VALUES (?, ?, ?, ?, ?)";

  try {
    await new Promise((resolve, reject) => {
      db.query(
        query,
        [name, address, country, tax_id, vat_id],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    return { message: "Company created successfully" };
  } catch (error) {
    throw new Error(`Error creating company: ${error.message}`);
  }
};

exports.getCompanyById = async (companyId) => {
  const query = "SELECT * FROM companies WHERE id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [companyId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (results.length === 0) {
      throw new Error("Company not found");
    }

    return results[0];
  } catch (error) {
    throw new Error(`Error fetching company: ${error.message}`);
  }
};

exports.updateCompany = async (companyId, companyData) => {
  const { name, address, country, tax_id, vat_id } = companyData;

  const query =
    "UPDATE companies SET name = ?, address = ?, country = ?, tax_id = ?, vat_id = ? WHERE id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        query,
        [name, address, country, tax_id, vat_id, companyId],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    if (results.affectedRows === 0) {
      throw new Error("Company not found or no changes made");
    }

    return { message: "Company updated successfully" };
  } catch (error) {
    throw new Error(`Error updating company: ${error.message}`);
  }
};

exports.deleteCompany = async (companyId) => {
  const query = "DELETE FROM companies WHERE id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [companyId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (results.affectedRows === 0) {
      throw new Error("Company not found");
    }

    return { message: "Company deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting company: ${error.message}`);
  }
};

exports.getAllCompanies = async () => {
  const query = "SELECT * FROM companies";

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
    throw new Error(`Error fetching companies: ${error.message}`);
  }
};

exports.getCompanyWithRelations = async (companyId) => {
  try {
    const result = await this.getCompanyById(companyId);

    console.log(JSON.parse(JSON.stringify(result)));

    const company = JSON.parse(JSON.stringify(result));

    console.log(company);

    const relatedCompaniesQuery = `
      SELECT company_id_2 FROM company_relations WHERE company_id_1 = ${companyId};
    `;

    const relatedCompaniesResults = await new Promise((resolve, reject) => {
      db.query(relatedCompaniesQuery, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    console.log("Related Companies IDs:", relatedCompaniesResults);

    const relatedCompanies = [];

    for (let i = 0; i < relatedCompaniesResults.length; i++) {
      const relatedCompanyId = relatedCompaniesResults[i].company_id_2;
      const relatedCompany = await this.getCompanyById(relatedCompanyId);
      const relatedCompanyJson = JSON.parse(JSON.stringify(relatedCompany));
      console.log("relatedCompany", relatedCompanyJson);
      relatedCompanies.push(relatedCompanyJson);
    }

    return {
      company,
      relatedCompanies,
    };
  } catch (err) {
    throw new Error(`Error fetching company with relations: ${err.message}`);
  }
};
