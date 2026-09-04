const reportStore = require('../models/reportStore');
const aiService = require('./aiService');

function matchOption(value, options) {
  if (typeof value !== 'string') return null;
  return options.find((option) => option.toLowerCase() === value.trim().toLowerCase());
}

function validateNewReport(data) {
  if (typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error('Title is required');
  }
  if (typeof data.description !== 'string' || !data.description.trim()) {
    throw new Error('Description is required');
  }
  if (data.description.trim().length < 10) {
    throw new Error('Description must be at least 10 characters');
  }
  if (typeof data.location !== 'string' || !data.location.trim()) {
    throw new Error('Location is required');
  }

  const category = matchOption(data.category, reportStore.CATEGORIES);
  if (!category) {
    throw new Error(`Category must be one of: ${reportStore.CATEGORIES.join(', ')}`);
  }
  data.category = category;

  if (data.severity !== undefined) {
    const severity = matchOption(data.severity, reportStore.SEVERITIES);
    if (!severity) {
      throw new Error(`Severity must be one of: ${reportStore.SEVERITIES.join(', ')}`);
    }
    data.severity = severity;
  }

  if (data.aiUrgency !== undefined) {
    const aiUrgency = matchOption(data.aiUrgency, reportStore.SEVERITIES);
    if (!aiUrgency) {
      throw new Error(`AI urgency must be one of: ${reportStore.SEVERITIES.join(', ')}`);
    }
    data.aiUrgency = aiUrgency;
  }

  if (data.isAnonymous !== undefined && typeof data.isAnonymous !== 'boolean') {
    throw new Error('isAnonymous must be true or false');
  }

  if (data.timeOfDay !== undefined && typeof data.timeOfDay !== 'string') {
    throw new Error('timeOfDay must be text');
  }

  if (data.aiSummary !== undefined && typeof data.aiSummary !== 'string') {
    throw new Error('aiSummary must be text');
  }
}

async function getAllReports(filters = {}) {
  let reports = await reportStore.getReports();

  if (filters.category) {
    const category = matchOption(filters.category, reportStore.CATEGORIES);
    if (!category) {
      const error = new Error('Unknown category filter');
      error.statusCode = 400;
      throw error;
    }
    reports = reports.filter((report) => report.category === category);
  }

  if (filters.status) {
    const status = matchOption(filters.status, reportStore.STATUSES);
    if (!status) {
      const error = new Error('Unknown status filter');
      error.statusCode = 400;
      throw error;
    }
    reports = reports.filter((report) => report.status === status);
  }

  if (filters.search) {
    const search = String(filters.search).trim().toLowerCase();
    reports = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(search) ||
        report.description.toLowerCase().includes(search),
    );
  }

  return reports;
}

async function getReportById(id) {
  const report = await reportStore.findReportById(id);
  if (!report) {
    const error = new Error('Report not found');
    error.statusCode = 404;
    throw error;
  }
  return report;
}

async function createReport(data) {
  validateNewReport(data);
  return await reportStore.createReport(data);
}

async function updateReportStatus(id, newStatus) {
  const report = await getReportById(id);
  const status = matchOption(newStatus, reportStore.STATUSES);
  if (!status) {
    const error = new Error(`Status must be one of: ${reportStore.STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
  return await reportStore.updateReportStatus(report.id || id, status);
}

async function upvoteReport(id) {
  const report = await getReportById(id);
  return await reportStore.upvoteReport(report.id || id);
}

async function getPlatformStats() {
  return await reportStore.getStats();
}

async function verifyReport(id) {
  const report = await getReportById(id);
  return await reportStore.verifyReport(report.id || id);
}

async function updateReportPriority(id, newPriority) {
  const report = await getReportById(id);
  let priority = newPriority ? matchOption(newPriority, reportStore.SEVERITIES) : 'High';
  if (!priority) {
    priority = 'High';
  }
  return await reportStore.setReportPriority(report.id || id, priority);
}

async function analyzeReport(description) {
  if (typeof description !== 'string' || !description.trim()) {
    const error = new Error('Description is required');
    error.statusCode = 400;
    throw error;
  }
  if (description.trim().length < 10) {
    const error = new Error('Description must be at least 10 characters for AI analysis');
    error.statusCode = 400;
    throw error;
  }

  return await aiService.analyzeReportDescription(description.trim());
}

async function getUserReports(userId) {
  if (!userId) {
    const error = new Error('User ID is required');
    error.statusCode = 400;
    throw error;
  }
  return await reportStore.getUserReports(userId);
}

module.exports = {
  getAllReports,
  getUserReports,
  getReportById,
  createReport,
  updateReportStatus,
  upvoteReport,
  getPlatformStats,
  verifyReport,
  updateReportPriority,
  analyzeReport,
  CATEGORIES: reportStore.CATEGORIES,
  SEVERITIES: reportStore.SEVERITIES,
  STATUSES: reportStore.STATUSES,
};
