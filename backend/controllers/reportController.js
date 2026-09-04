const reportService = require('../services/reportService');

/**
 * Controller layer handles HTTP requests and responses.
 * Delegates all business logic, validation, and storage operations to reportService.
 */

async function listReports(req, res) {
  try {
    const { category, status, search } = req.query;
    const reports = reportService.getAllReports({ category, status, search });
    return res.json({ count: reports.length, reports });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
}

async function getReport(req, res) {
  try {
    const report = reportService.getReportById(req.params.id);
    return res.json({ report });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

async function addReport(req, res) {
  try {
    const report = reportService.createReport(req.body || {});
    return res.status(201).json({ message: 'Report created successfully', report });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
}

async function changeStatus(req, res) {
  try {
    const report = reportService.updateReportStatus(req.params.id, req.body?.status);
    return res.json({ message: 'Report status updated successfully', report });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
}

async function upvote(req, res) {
  try {
    const report = reportService.upvoteReport(req.params.id);
    return res.json({ message: 'Upvote added successfully', report });
  } catch (err) {
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

async function analyzeReport(req, res) {
  try {
    const result = await reportService.analyzeReport(req.body?.description);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message });
  }
}

async function getStats(req, res) {
  try {
    const stats = reportService.getPlatformStats();
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve stats' });
  }
}

async function verifyReport(req, res) {
  try {
    const report = reportService.verifyReport(req.params.id);
    return res.json({ message: 'Report marked as verified', report });
  } catch (err) {
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

async function setPriority(req, res) {
  try {
    const report = reportService.updateReportPriority(req.params.id, req.body?.priority);
    return res.json({ message: 'Report priority updated successfully', report });
  } catch (err) {
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

module.exports = {
  listReports,
  getReport,
  addReport,
  changeStatus,
  upvote,
  analyzeReport,
  getStats,
  verifyReport,
  setPriority,
};
