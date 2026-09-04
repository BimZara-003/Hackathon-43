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
    lat: 7.29,
    lng: 80.633,
  },
  {
    title: 'Poorly lit isolated bus stop',
    description: 'The bus stop and nearby footpath are dark and feel isolated after evening hours.',
    category: 'Unsafe Area',
    location: 'Baseline Road, Dematagoda, Colombo 09',
    severity: 'High',
    status: 'Open',
    isAnonymous: true,
    timeOfDay: 'Unsafe after dark',
    safetyContext: 'Lack of working streetlights and high pedestrian traffic at night.',
    aiSummary: 'Poor lighting and isolation create a safety concern around the bus stop at night.',
    aiUrgency: 'High',
    upvotes: 22,
    isVerified: true,
    priority: 'High',
    lat: 6.927,
    lng: 79.878,
  },
  {
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
    isVerified: true,
    priority: 'High',
    lat: 5.972,
    lng: 80.428,
  },
  {
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
    isVerified: true,
    priority: 'Medium',
    lat: 9.661,
    lng: 80.025,
  },
  {
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
    isVerified: true,
    priority: 'Low',
    lat: 7.717,
    lng: 81.7,
  },
  {
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
    isVerified: false,
    priority: 'Medium',
    lat: 6.053,
    lng: 80.217,
  },
];

let inMemoryStore = [...initialSeedReports.map((r, i) => ({ id: String(i + 1), ...r }))];
let isMongooseConnected = false;

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
    isMongooseConnected = true;
  } catch (error) {
    console.error('[DB] Seeding failed:', error.message);
    isMongooseConnected = false;
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
  if (isMongooseConnected) {
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
  if (isMongooseConnected) {
    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const doc = await Report.findById(id);
        if (doc) return normalizeDoc(doc);
      }
      const docByTitle = await Report.findOne({ id });
      if (docByTitle) return normalizeDoc(docByTitle);
    } catch (e) {
      console.warn('[DB] Mongoose findById error:', e.message);
    }
  }
  return inMemoryStore.find((r) => r.id === String(id));
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
    aiUrgency: data.aiUrgency || data.severity || 'Medium',
    upvotes: 0,
    isVerified: data.isVerified ?? false,
    priority: data.priority || data.severity || 'Medium',
    lat: data.lat || 6.9271,
    lng: data.lng || 79.8612,
    userId: data.userId || null,
  };

  if (isMongooseConnected) {
    try {
      const doc = await Report.create(reportObj);
      const normalized = normalizeDoc(doc);
      inMemoryStore.unshift(normalized);
      return normalized;
    } catch (e) {
      console.error('[DB] Mongoose create error:', e.message);
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

  if (isMongooseConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
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

  if (isMongooseConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
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

  if (isMongooseConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
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

  if (isMongooseConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
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
  if (isMongooseConnected) {
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
  if (isMongooseConnected) {
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
