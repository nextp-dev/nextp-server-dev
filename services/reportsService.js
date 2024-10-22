const db = require("../config/db");

exports.createReport = async (reportData) => {
  const { company_id, report_name, report_url } = reportData;

  const query = `
    INSERT INTO reports (company_id, report_name, report_url)
    VALUES (?, ?, ?)
  `;

  try {
    await new Promise((resolve, reject) => {
      db.query(
        query,
        [company_id, report_name, report_url],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    return { message: "Report created successfully" };
  } catch (error) {
    throw new Error(`Error creating report: ${error.message}`);
  }
};

exports.getReportsByCompanyId = async (companyId) => {
  const query = "SELECT * FROM reports WHERE company_id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [companyId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return results;
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};

exports.updateReport = async (reportId, reportData) => {
  const { report_name, report_url } = reportData;

  const query = `
    UPDATE reports 
    SET report_name = ?, report_url = ?
    WHERE id = ?
  `;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [report_name, report_url, reportId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (results.affectedRows === 0) {
      throw new Error("Report not found or no changes made");
    }

    return { message: "Report updated successfully" };
  } catch (error) {
    throw new Error(`Error updating report: ${error.message}`);
  }
};

exports.deleteReport = async (reportId) => {
  const query = "DELETE FROM reports WHERE id = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [reportId], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (results.affectedRows === 0) {
      throw new Error("Report not found");
    }

    return { message: "Report deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting report: ${error.message}`);
  }
};
