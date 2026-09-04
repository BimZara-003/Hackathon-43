const reportStore = require('../models/reportStore');
const aiService = require('../services/aiService');

function matchOption(value, options) {
  if (typeof value !== 'string') return null;
  return options.find((option) => option.toLowerCase() === value.trim().toLowerCase());
}

function validateNewReport(body) {
  if (typeof body.title !== 'string' || !body.title.trim()) {
    return 'Title is required';
  }
  if (typeof body.description !== 'string' || !body.description.trim()) {
    return 'Description is required';
  }
  if (body.description.trim().length < 10) {
    return 'Description must be at least 10 characters';
  }
  if (typeof body.location !== 'string' || !body.location.trim()) {
    return 'Location is required';
  }

  const category = matchOption(body.category, reportStore.CATEGORIES);
  if (!category) {
    return `Category must be one of: ${reportStore.CATEGORIES.join(', ')}`;
  }
  body.category = category;

  if (body.severity !== undefined) {
    const severity = matchOption(body.severity, reportStore.SEVERITIES);
    if (!severity) {
      return `Severity must be one of: ${reportStore.SEVERITIES.join(', ')}`;
    }
    body.severity = severity;
  }

  if (body.aiUrgency !== undefined) {
    const aiUrgency = matchOption(body.aiUrgency, reportStore.SEVERITIES);
    if (!aiUrgency) {
      return `AI urgency must be one of: ${reportStore.SEVERITIES.join(', ')}`;
    }
    body.aiUrgency = aiUrgency;
  }

  if (body.isAnonymous !== undefined && typeof body.isAnonymous !== 'boolean') {
    return 'isAnonymous must be true or false';
  }

  if (body.timeOfDay !== undefined && typeof body.timeOfDay !== 'string') {
    return 'timeOfDay must be text';
  }

  return null;
}

function listReports(req, res) {
  let reports = [...reportStore.getReports()];

  if (req.query.category) {
    const category = matchOption(req.query.category, reportStore.CATEGORIES);
    if (!category) {
      return res.status(400).json({ error: 'Unknown category filter' });
    }
    reports = reports.filter((report) => report.category === category);
  }

  if (req.query.status) {
    const status = matchOption(req.query.status, reportStore.STATUSES);
    if (!status) {
      return res.status(400).json({ error: 'Unknown status filter' });
    }
    reports = reports.filter((report) => report.status === status);
  }

  if (req.query.search) {
    const search = String(req.query.search).trim().toLowerCase();
    reports = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(search) ||
        report.description.toLowerCase().includes(search),
    );
  }

  return res.json({ count: reports.length, reports });
}

function getReport(req, res) {
  const report = reportStore.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  return res.json({ report });
}

function addReport(req, res) {
  const body = req.body || {};
  const validationError = validateNewReport(body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (body.aiSummary !== undefined && typeof body.aiSummary !== 'string') {
    return res.status(400).json({ error: 'aiSummary must be text' });
  }

  const report = reportStore.createReport(body);
  return res.status(201).json({ message: 'Report created successfully', report });
}

function changeStatus(req, res) {
  const report = reportStore.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const status = matchOption(req.body?.status, reportStore.STATUSES);
  if (!status) {
    return res.status(400).json({
      error: `Status must be one of: ${reportStore.STATUSES.join(', ')}`,
    });
  }

  reportStore.updateReportStatus(report, status);
  return res.json({ message: 'Report status updated successfully', report });
}

function upvote(req, res) {
  const report = reportStore.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  reportStore.upvoteReport(report);
  return res.json({ message: 'Upvote added successfully', report });
}

async function analyzeReport(req, res) {
  const { description } = req.body || {};
  if (typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'Description is required' });
  }
  if (description.trim().length < 10) {
    return res.status(400).json({ error: 'Description must be at least 10 characters for AI analysis' });
  }

  const result = await aiService.analyzeReportDescription(description.trim());
  return res.json(result);
}

function getStats(req, res) {
  const stats = reportStore.getStats();
  return res.json(stats);
}

function verifyReport(req, res) {
  const report = reportStore.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  reportStore.verifyReport(report);
  return res.json({ message: 'Report marked as verified', report });
}

function setPriority(req, res) {
  const report = reportStore.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  let priority = req.body?.priority;
  if (priority) {
    priority = matchOption(priority, reportStore.SEVERITIES);
  }
  if (!priority) {
    priority = 'High';
  }

  reportStore.setReportPriority(report, priority);
  return res.json({ message: 'Report priority updated successfully', report });
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
