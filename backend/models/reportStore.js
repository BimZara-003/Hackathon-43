const mongoose = require('mongoose');
const { Report, CATEGORIES, SEVERITIES, STATUSES } = require('./Report');

const initialSeedReports = [
  {
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
    isVerified: true,
    priority: 'High',
    lat: 6.892,
    lng: 79.855,
  },
  {
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
    isVerified: true,
    priority: 'Medium',
    lat: 6.851,
    lng: 79.865,
  },
  {
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
    isVerified: false,
    priority: 'Medium',
    lat: 7.2906,
    lng: 80.6337,
  },
  {
    title: 'Damaged culvert edge near bend',
    description: 'The edge of the culvert has collapsed into the ditch without warning signs.',
    category: 'Road Damage',
    location: 'A9 Road, Kilinochchi',
    severity: 'High',
    status: 'Open',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Collapsed culvert edge presents severe night hazard on A9.',
    aiUrgency: 'High',
    upvotes: 24,
    isVerified: true,
    priority: 'High',
    lat: 9.3803,
    lng: 80.4037,
  },
  {
    title: 'Unlit pedestrian stretch near bus stop',
    description: 'Poorly lit section where passengers wait for buses after 8 PM.',
    category: 'Unsafe Area',
    location: 'High Level Road, Maharagama',
    severity: 'High',
    status: 'Open',
    isAnonymous: true,
    timeOfDay: 'After 8 PM',
    safetyContext: 'Women waiting for evening buses report feeling unsafe due to total darkness.',
    aiSummary: 'Dark pedestrian area presents safety concern for late commuters.',
    aiUrgency: 'High',
    upvotes: 31,
    isVerified: true,
    priority: 'High',
    lat: 6.848,
    lng: 79.926,
  },
  {
    title: 'Broken streetlight behind market complex',
    description: 'Streetlight pole leans dangerously and light flickers constantly.',
    category: 'Streetlight',
    location: 'Main Street, Negombo',
    severity: 'Low',
    status: 'Resolved',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Flickering pole repaired by local council workforce.',
    aiUrgency: 'Low',
    upvotes: 7,
    isVerified: true,
    priority: 'Low',
    lat: 7.2083,
    lng: 79.8358,
  },
  {
    title: 'Unsafe isolated lane near campus back gate',
    description: 'Students walking home after evening classes report zero lighting.',
    category: 'Unsafe Area',
    location: 'University Road, Jaffna',
    severity: 'Medium',
    status: 'In Progress',
    isAnonymous: true,
    timeOfDay: '6:30 PM - 10:00 PM',
    safetyContext: 'Isolated university stretch with no functional lamps.',
    aiSummary: 'Unlit student pedestrian corridor scheduled for solar streetlamp install.',
    aiUrgency: 'Medium',
    upvotes: 42,
    isVerified: true,
    priority: 'Medium',
    lat: 9.6849,
    lng: 80.022,
  },
  {
    title: 'Multiple potholes near Galle bus stand',
    description: 'Heavy rainfall eroded the asphalt creating 3 large water-filled holes.',
    category: 'Pothole',
    location: 'Bus Stand Road, Galle',
    severity: 'Medium',
    status: 'Open',
    isAnonymous: true,
    timeOfDay: null,
    aiSummary: 'Multiple water-filled potholes obstruct the Galle bus stand entrance.',
    aiUrgency: 'Medium',
    upvotes: 13,
    isVerified: false,
    priority: 'Medium',
    lat: 6.053,
    lng: 80.217,
  },
];

let inMemoryStore = [...initialSeedReports.map((r, i) => ({ id: String(i + 1), ...r }))];
let isMongooseConnectedFlag = false;

function isConnected() {
  return mongoose.connection.readyState === 1 || isMongooseConnectedFlag;
}

async function seedDatabaseIfEmpty() {
  try {
    const count = await Report.countDocuments();
    if (count === 0) {
      console.log('[DB] Database collection is empty. Seeding initial Sri Lankan reports...');
      await Report.insertMany(initialSeedReports);
      console.log(`[DB] Successfully seeded ${initialSeedReports.length} reports to MongoDB Atlas!`);
    } else {
      console.log(`[DB] MongoDB Atlas contains ${count} reports.`);
    }
    isMongooseConnectedFlag = true;
  } catch (error) {
    console.error('[DB] Seeding failed:', error.message);
  }
}

function normalizeDoc(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj.id || obj._id?.toString(),
  };
}

async function getReports() {
  if (isConnected()) {
    try {
      const docs = await Report.find().sort({ createdAt: -1 });
      return docs.map(normalizeDoc);
    } catch (e) {
      console.warn('[DB] Mongoose fetch error, falling back to memory:', e.message);
    }
  }

  return inMemoryStore;
}

async function findReportById(id) {
  if (isConnected() && String(id).match(/^[0-9a-fA-F]{24}$/)) {
    try {
      const doc = await Report.findById(id);
      if (doc) return normalizeDoc(doc);
    } catch (e) {
      console.warn('[DB] Mongoose findById error:', e.message);
    }
  }

  return inMemoryStore.find((r) => r.id === String(id)) || null;
}

async function createReport(data) {
  const reportObj = {
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    location: data.location.trim(),
    severity: data.severity || 'Medium',
    status: 'Open',
    isAnonymous: data.isAnonymous ?? false,
    timeOfDay: data.timeOfDay?.trim() || null,
    safetyContext: data.safetyContext?.trim() || null,
    aiSummary: data.aiSummary?.trim() || '',
    aiUrgency: ['Low', 'Medium', 'High'].includes(data.aiUrgency) ? data.aiUrgency : (data.severity || 'Medium'),
    upvotes: 0,
    isVerified: data.isVerified ?? false,
    priority: ['Low', 'Medium', 'High'].includes(data.priority) ? data.priority : (data.severity || 'Medium'),
    lat: Number(data.lat) || 6.9271,
    lng: Number(data.lng) || 79.8612,
    userId: data.userId || null,
  };

  if (isConnected()) {
    try {
      const doc = await Report.create(reportObj);
      const normalized = normalizeDoc(doc);
      console.log('[DB] New report saved to MongoDB Atlas with ID:', normalized.id);
      inMemoryStore.unshift(normalized);
      return normalized;
    } catch (e) {
      console.error('[DB] Mongoose create error:', e.message);
      throw e;
    }
  }

  const memDoc = {
    id: String(inMemoryStore.length + 1),
    ...reportObj,
    createdAt: new Date().toISOString(),
  };
  inMemoryStore.unshift(memDoc);
  return memDoc;
}

async function updateReportStatus(reportOrId, status) {
  const id = typeof reportOrId === 'object' ? reportOrId.id : reportOrId;

  if (isConnected() && String(id).match(/^[0-9a-fA-F]{24}$/)) {
    try {
      const doc = await Report.findByIdAndUpdate(id, { status }, { new: true });
      if (doc) return normalizeDoc(doc);
    } catch (e) {
      console.error('[DB] Mongoose update status error:', e.message);
    }
  }

  const report = typeof reportOrId === 'object' ? reportOrId : inMemoryStore.find((r) => r.id === String(id));
  if (report) {
    report.status = status;
    return report;
  }
  return null;
}

async function upvoteReport(reportOrId) {
  const id = typeof reportOrId === 'object' ? reportOrId.id : reportOrId;

  if (isConnected() && String(id).match(/^[0-9a-fA-F]{24}$/)) {
    try {
      const doc = await Report.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true });
      if (doc) return normalizeDoc(doc);
    } catch (e) {
      console.error('[DB] Mongoose upvote error:', e.message);
    }
  }

  const report = typeof reportOrId === 'object' ? reportOrId : inMemoryStore.find((r) => r.id === String(id));
  if (report) {
    report.upvotes += 1;
    return report;
  }
  return null;
}

async function verifyReport(reportOrId) {
  const id = typeof reportOrId === 'object' ? reportOrId.id : reportOrId;

  if (isConnected() && String(id).match(/^[0-9a-fA-F]{24}$/)) {
    try {
      const doc = await Report.findByIdAndUpdate(id, { isVerified: true }, { new: true });
      if (doc) return normalizeDoc(doc);
    } catch (e) {
      console.error('[DB] Mongoose verify error:', e.message);
    }
  }

  const report = typeof reportOrId === 'object' ? reportOrId : inMemoryStore.find((r) => r.id === String(id));
  if (report) {
    report.isVerified = true;
    return report;
  }
  return null;
}

async function setReportPriority(reportOrId, priority) {
  const id = typeof reportOrId === 'object' ? reportOrId.id : reportOrId;

  if (isConnected() && String(id).match(/^[0-9a-fA-F]{24}$/)) {
    try {
      const doc = await Report.findByIdAndUpdate(id, { priority, severity: priority }, { new: true });
      if (doc) return normalizeDoc(doc);
    } catch (e) {
      console.error('[DB] Mongoose set priority error:', e.message);
    }
  }

  const report = typeof reportOrId === 'object' ? reportOrId : inMemoryStore.find((r) => r.id === String(id));
  if (report) {
    report.priority = priority;
    report.severity = priority;
    return report;
  }
  return null;
}

async function getStats() {
  if (isConnected()) {
    try {
      const totalReports = await Report.countDocuments();
      const openCount = await Report.countDocuments({ status: 'Open' });
      const inProgressCount = await Report.countDocuments({ status: 'In Progress' });
      const resolvedCount = await Report.countDocuments({ status: 'Resolved' });

      return {
        totalReports,
        openCount,
        inProgressCount,
        resolvedCount,
      };
    } catch (e) {
      console.warn('[DB] Mongoose stats error, falling back to memory:', e.message);
    }
  }

  const totalReports = inMemoryStore.length;
  const openCount = inMemoryStore.filter((r) => r.status === 'Open').length;
  const inProgressCount = inMemoryStore.filter((r) => r.status === 'In Progress').length;
  const resolvedCount = inMemoryStore.filter((r) => r.status === 'Resolved').length;

  return {
    totalReports,
    openCount,
    inProgressCount,
    resolvedCount,
  };
}

async function getUserReports(userId) {
  if (isConnected()) {
    try {
      const docs = await Report.find({ userId }).sort({ createdAt: -1 });
      return docs.map(normalizeDoc);
    } catch (e) {
      console.warn('[DB] Mongoose getUserReports error:', e.message);
    }
  }
  return inMemoryStore.filter((r) => r.userId === userId);
}

module.exports = {
  CATEGORIES,
  SEVERITIES,
  STATUSES,
  seedDatabaseIfEmpty,
  getReports,
  getUserReports,
  findReportById,
  createReport,
  updateReportStatus,
  upvoteReport,
  getStats,
  verifyReport,
  setReportPriority,
};
