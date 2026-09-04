const CATEGORIES = [
  'Pothole',
  'Streetlight',
  'Drainage',
  'Road Damage',
  'Unsafe Area',
  'Other',
];

const SEVERITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];

const daysAgo = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const reports = [
  {
    id: '1',
    title: 'Deep pothole near Bambalapitiya junction',
    description: 'A deep pothole in the left lane is forcing buses to swerve suddenly.',
    category: 'Pothole',
    location: 'Galle Road, Bambalapitiya, Colombo 04',
    severity: 'High',
    status: 'Open',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Large pothole creates an immediate collision risk on a busy bus route.',
    aiUrgency: 'High',
    upvotes: 18,
    createdAt: daysAgo(1),
  },
  {
    id: '2',
    title: 'Streetlights not working near railway station',
    description: 'Several streetlights are not working along the road beside the station.',
    category: 'Streetlight',
    location: 'Station Road, Dehiwala',
    severity: 'Medium',
    status: 'In Progress',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Multiple failed streetlights reduce visibility near Dehiwala station.',
    aiUrgency: 'Medium',
    upvotes: 11,
    createdAt: daysAgo(3),
  },
  {
    id: '3',
    title: 'Blocked drain causing road flooding',
    description: 'The roadside drain is blocked and the lane floods even after light rain.',
    category: 'Drainage',
    location: 'Peradeniya Road, Kandy',
    severity: 'Medium',
    status: 'Open',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Blocked drainage is repeatedly flooding part of Peradeniya Road.',
    aiUrgency: 'Medium',
    upvotes: 9,
    createdAt: daysAgo(4),
  },
  {
    id: '4',
    title: 'Poorly lit isolated bus stop',
    description: 'The bus stop and nearby footpath are dark and feel isolated after evening hours.',
    category: 'Unsafe Area',
    location: 'Baseline Road, Dematagoda, Colombo 09',
    severity: 'High',
    status: 'Open',
    isAnonymous: true,
    timeOfDay: 'Unsafe after dark',
    aiSummary: 'Poor lighting and isolation create a safety concern around the bus stop at night.',
    aiUrgency: 'High',
    upvotes: 22,
    createdAt: daysAgo(2),
  },
  {
    id: '5',
    title: 'Broken road edge near bridge',
    description: 'The road edge has collapsed near the bridge and needs a visible safety barrier.',
    category: 'Road Damage',
    location: 'Matara Road, Weligama',
    severity: 'High',
    status: 'In Progress',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Collapsed road edge near a bridge requires a barrier and urgent repair.',
    aiUrgency: 'High',
    upvotes: 15,
    createdAt: daysAgo(6),
  },
  {
    id: '6',
    title: 'Loose manhole cover',
    description: 'A loose manhole cover makes a loud movement whenever a vehicle passes over it.',
    category: 'Other',
    location: 'Hospital Street, Jaffna',
    severity: 'Medium',
    status: 'Resolved',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'An unstable manhole cover may become dangerous to road users.',
    aiUrgency: 'Medium',
    upvotes: 7,
    createdAt: daysAgo(9),
  },
  {
    id: '7',
    title: 'Damaged pedestrian crossing surface',
    description: 'The crossing surface is cracked and difficult for wheelchairs and older pedestrians.',
    category: 'Road Damage',
    location: 'Main Street, Batticaloa',
    severity: 'Low',
    status: 'Resolved',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Cracked crossing surface affects pedestrian accessibility.',
    aiUrgency: 'Low',
    upvotes: 5,
    createdAt: daysAgo(12),
  },
  {
    id: '8',
    title: 'Potholes at Galle bus stand entrance',
    description: 'Several potholes at the entrance slow buses and collect stagnant rainwater.',
    category: 'Pothole',
    location: 'Colombo Road, Galle',
    severity: 'Medium',
    status: 'Open',
    isAnonymous: true,
    timeOfDay: null,
    aiSummary: 'Multiple water-filled potholes obstruct the Galle bus stand entrance.',
    aiUrgency: 'Medium',
    upvotes: 13,
    createdAt: daysAgo(5),
  },
];

let nextId = reports.length + 1;

function getStats() {
  const totalReports = reports.length;
  const openCount = reports.filter((r) => r.status === 'Open').length;
  const inProgressCount = reports.filter((r) => r.status === 'In Progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  return {
    totalReports,
    openCount,
    inProgressCount,
    resolvedCount,
  };
}

function getReports() {
  return reports;
}

function findReportById(id) {
  return reports.find((report) => report.id === String(id));
}

function createReport(data) {
  const report = {
    id: String(nextId++),
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    location: data.location.trim(),
    severity: data.severity || 'Medium',
    status: 'Open',
    isAnonymous: data.isAnonymous ?? false,
    timeOfDay: data.timeOfDay?.trim() || null,
    aiSummary: data.aiSummary?.trim() || '',
    aiUrgency: data.aiUrgency || data.severity || 'Medium',
    upvotes: 0,
    isVerified: data.isVerified ?? false,
    priority: data.priority || data.severity || 'Medium',
    createdAt: new Date().toISOString(),
  };

  reports.unshift(report);
  return report;
}

function updateReportStatus(report, status) {
  report.status = status;
  return report;
}

function upvoteReport(report) {
  report.upvotes += 1;
  return report;
}

function verifyReport(report) {
  report.isVerified = true;
  return report;
}

function setReportPriority(report, priority) {
  report.priority = priority;
  report.severity = priority;
  return report;
}

module.exports = {
  CATEGORIES,
  SEVERITIES,
  STATUSES,
  getReports,
  findReportById,
  createReport,
  updateReportStatus,
  upvoteReport,
  getStats,
  verifyReport,
  setReportPriority,
};
