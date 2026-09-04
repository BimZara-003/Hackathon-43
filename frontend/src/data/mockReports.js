/**
 * mockReports.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared mock data for the Mithuru Mawatha app.
 * Each report matches the shared Report type agreed with the team:
 *   { id, title, description, category, location, severity, status,
 *     isAnonymous, timeOfDay, aiSummary, aiUrgency, upvotes, createdAt }
 *
 * Extra fields added for the map: lat, lng (real coordinates for Sri Lanka).
 *
 * TO SWAP FOR A REAL API: replace the export with a fetch() call to GET /reports
 * and add lat/lng to the backend response.
 */

const daysAgo = (n) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const mockReports = [
  {
    id: '1',
    title: 'Deep pothole near Bambalapitiya junction',
    description:
      'A deep pothole about 40 cm wide has opened in the left bus lane. Buses swerve suddenly into the right lane, creating serious collision risk during peak hours.',
    category: 'Pothole',
    location: 'Galle Road, Bambalapitiya, Colombo 04',
    lat: 6.8938,
    lng: 79.8576,
    severity: 'High',
    status: 'Open',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Large pothole causes sudden bus swerving — immediate collision risk on a busy route.',
    aiUrgency: 'High',
    upvotes: 18,
    createdAt: daysAgo(1),
  },
  {
    id: '2',
    title: 'Streetlights not working near Dehiwala railway station',
    description:
      'Several consecutive streetlights alongside the road by the station have been out for over two weeks. The area is very dark at night, especially near the level crossing.',
    category: 'Streetlight',
    location: 'Station Road, Dehiwala',
    lat: 6.8594,
    lng: 79.8647,
    severity: 'Medium',
    status: 'In Progress',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Multiple failed streetlights reduce visibility near Dehiwala station and the level crossing.',
    aiUrgency: 'Medium',
    upvotes: 11,
    createdAt: daysAgo(3),
  },
  {
    id: '3',
    title: 'Blocked drain causing road flooding on Peradeniya Road',
    description:
      'The roadside drain is completely blocked with debris. Even light rain causes the left lane to flood 10–15 cm deep, making it impassable for motorcycles and tuk-tuks.',
    category: 'Drainage',
    location: 'Peradeniya Road, Kandy',
    lat: 7.2906,
    lng: 80.6337,
    severity: 'Medium',
    status: 'Open',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Blocked drainage repeatedly floods part of Peradeniya Road — risk to small vehicles.',
    aiUrgency: 'Medium',
    upvotes: 9,
    createdAt: daysAgo(4),
  },
  {
    id: '4',
    title: 'Poorly lit, isolated bus stop — unsafe after dark',
    description:
      'The bus stop and nearby footpath are completely dark and isolated after 7 pm. There are no other businesses or pedestrians nearby, making it feel unsafe particularly for women travelling alone.',
    category: 'Unsafe Area',
    location: 'Baseline Road, Dematagoda, Colombo 09',
    lat: 6.9167,
    lng: 79.8782,
    severity: 'High',
    status: 'Open',
    isAnonymous: true,
    timeOfDay: 'Unsafe after dark',
    aiSummary: 'Poor lighting and isolation create a serious safety concern around the bus stop at night.',
    aiUrgency: 'High',
    upvotes: 22,
    createdAt: daysAgo(2),
  },
  {
    id: '5',
    title: 'Collapsed road edge near bridge on Matara Road',
    description:
      'About 1.5 metres of the left road edge has crumbled away near the bridge. There is no barrier or warning sign. Vehicles travelling at night could easily drive off the edge.',
    category: 'Road Damage',
    location: 'Matara Road, Weligama',
    lat: 5.9767,
    lng: 80.4290,
    severity: 'High',
    status: 'In Progress',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Collapsed road edge near a bridge requires an urgent safety barrier and repair.',
    aiUrgency: 'High',
    upvotes: 15,
    createdAt: daysAgo(6),
  },
  {
    id: '6',
    title: 'Loose manhole cover rattling on Hospital Street',
    description:
      'A loose manhole cover makes a loud banging noise each time a vehicle crosses it. The movement is getting worse — if it shifts further, it could trap a motorcycle tyre.',
    category: 'Other',
    location: 'Hospital Street, Jaffna',
    lat: 9.6615,
    lng: 80.0255,
    severity: 'Medium',
    status: 'Resolved',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Unstable manhole cover poses a tyre-trap hazard for motorcycles.',
    aiUrgency: 'Medium',
    upvotes: 7,
    createdAt: daysAgo(9),
  },
  {
    id: '7',
    title: 'Cracked pedestrian crossing surface — inaccessible for wheelchairs',
    description:
      'The zebra crossing surface is heavily cracked and uneven. Wheelchair users and elderly pedestrians cannot cross safely. The dropped kerb on one side has also broken away.',
    category: 'Road Damage',
    location: 'Main Street, Batticaloa',
    lat: 7.7172,
    lng: 81.6951,
    severity: 'Low',
    status: 'Resolved',
    isAnonymous: false,
    timeOfDay: null,
    aiSummary: 'Cracked crossing surface and broken kerb make pedestrian access inaccessible.',
    aiUrgency: 'Low',
    upvotes: 5,
    createdAt: daysAgo(12),
  },
  {
    id: '8',
    title: 'Multiple potholes at Galle bus stand entrance',
    description:
      'At least four large potholes at the bus stand entrance are collecting stagnant rainwater. Buses slow to a crawl to navigate them, causing delays on the Colombo route during peak hours.',
    category: 'Pothole',
    location: 'Colombo Road, Galle',
    lat: 6.0535,
    lng: 80.2210,
    severity: 'Medium',
    status: 'Open',
    isAnonymous: true,
    timeOfDay: null,
    aiSummary: 'Water-filled potholes at the Galle bus stand entrance are causing bus delays.',
    aiUrgency: 'Medium',
    upvotes: 13,
    createdAt: daysAgo(5),
  },
];

// ─── Lookup helpers used by filters ────────────────────────────────────────

export const CATEGORIES = [
  'Pothole',
  'Streetlight',
  'Drainage',
  'Road Damage',
  'Unsafe Area',
  'Other',
];

export const STATUSES = ['Open', 'In Progress', 'Resolved'];

export const SEVERITIES = ['Low', 'Medium', 'High'];

/** Returns the next logical status in the workflow. */
export const nextStatus = (current) => {
  const flow = { Open: 'In Progress', 'In Progress': 'Resolved', Resolved: 'Resolved' };
  return flow[current] ?? 'Resolved';
};

