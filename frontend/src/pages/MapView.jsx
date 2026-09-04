/**
 * MapView.jsx — Map View page
 * ─────────────────────────────────────────────────────────────────────────────
 * Features:
 *  ✅ Leaflet + OpenStreetMap map — no API key required
 *  ✅ All reports shown as colour-coded pins
 *  ✅ Round pin = infrastructure, Diamond pin = Unsafe Area
 *  ✅ Pin colour = severity (red / amber / green)
 *  ✅ Click pin → popup with title, category, status, description, emergency contacts
 *  ✅ Category filter toggle chips above the map
 *  ✅ List ↔ Map toggle at the top
 *  ✅ Safer Route indicator — flags if a searched location string
 *     matches an Unsafe Area report's location
 *  ✅ Map legend rendered inside the map (handled by ReportMap)
 *
 * ReportMap is fully isolated — all Leaflet logic lives there.
 * This page only manages filter state and passes data down.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Map as MapIcon, Search, ShieldCheck, ShieldAlert } from 'lucide-react';

import { mockReports, CATEGORIES } from '../data/mockReports';
import ReportMap from '../components/ReportMap';

// ─── Category chip colours ─────────────────────────────────────────────────
const CHIP_STYLE = {
  Pothole:       { active: 'bg-orange-500 text-white border-orange-500', idle: 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50' },
  Streetlight:   { active: 'bg-yellow-400 text-gray-900 border-yellow-400', idle: 'bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50' },
  Drainage:      { active: 'bg-cyan-500 text-white border-cyan-500', idle: 'bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50' },
  'Road Damage': { active: 'bg-red-500 text-white border-red-500', idle: 'bg-white text-red-700 border-red-300 hover:bg-red-50' },
  'Unsafe Area': { active: 'bg-purple-600 text-white border-purple-600', idle: 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50' },
  Other:         { active: 'bg-gray-600 text-white border-gray-600', idle: 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' },
};

const CATEGORY_ICON = {
  Pothole:       '🕳️',
  Streetlight:   '💡',
  Drainage:      '💧',
  'Road Damage': '🚧',
  'Unsafe Area': '🛡️',
  Other:         '📍',
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function MapView() {
  const navigate = useNavigate();

  // All categories shown by default
  const [activeCategories, setActiveCategories] = useState(new Set(CATEGORIES));

  // Safer route search
  const [routeSearch, setRouteSearch] = useState('');

  // ── Toggle a single category chip ──
  function toggleCategory(cat) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        // Don't allow deselecting the last active category
        if (next.size === 1) return prev;
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  // ── Select / deselect all ──
  const allSelected = activeCategories.size === CATEGORIES.length;
  function toggleAll() {
    setActiveCategories(allSelected ? new Set([CATEGORIES[0]]) : new Set(CATEGORIES));
  }

  // ── Safer Route check ──
  // Returns list of unsafe-area reports whose location matches the search string
  const nearbyUnsafe = useMemo(() => {
    if (!routeSearch.trim()) return [];
    const q = routeSearch.toLowerCase();
    return mockReports.filter(
      (r) =>
        r.category === 'Unsafe Area' &&
        (r.location.toLowerCase().includes(q) || r.title.toLowerCase().includes(q))
    );
  }, [routeSearch]);

  const routeIsSafe    = routeSearch.trim() && nearbyUnsafe.length === 0;
  const routeHasRisk   = nearbyUnsafe.length > 0;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">

          {/* Title + List/Map toggle */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Map View</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                All {mockReports.length} reports plotted on the map · OpenStreetMap
              </p>
            </div>

            {/* List ↔ Map toggle */}
            <div className="flex rounded-xl overflow-hidden border border-orange-200 shadow-sm">
              <button
                onClick={() => navigate('/reports')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 transition-colors"
              >
                <List className="w-4 h-4" /> List
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-600 text-white"
                aria-current="page"
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
            </div>
          </div>

          {/* ── Safer Route indicator ── */}
          <div className="mt-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Check a location for safety risks… (e.g. Dematagoda)"
                value={routeSearch}
                onChange={(e) => setRouteSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
              />
            </div>

            {/* Result */}
            {routeIsSafe && (
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                No known safety risks reported near <strong>"{routeSearch}"</strong>
              </div>
            )}
            {routeHasRisk && (
              <div className="mt-2 max-w-xl">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                  <ShieldAlert className="w-4 h-4" />
                  ⚠ {nearbyUnsafe.length} safety risk report{nearbyUnsafe.length > 1 ? 's' : ''} near <strong>"{routeSearch}"</strong>
                </div>
                <ul className="mt-2 space-y-1">
                  {nearbyUnsafe.map((r) => (
                    <li key={r.id} className="text-xs text-red-700 pl-4 flex items-start gap-1">
                      <span className="mt-0.5">•</span>
                      <span>
                        <strong>{r.title}</strong> — {r.location}
                        {r.timeOfDay && <span className="ml-1 italic text-red-500">({r.timeOfDay})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Category filter chips ── */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 font-medium">Filter:</span>

            {/* All / None toggle */}
            <button
              onClick={toggleAll}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                allSelected
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {allSelected ? 'All shown' : 'Show all'}
            </button>

            {CATEGORIES.map((cat) => {
              const isActive = activeCategories.has(cat);
              const style    = CHIP_STYLE[cat];
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                    isActive ? style.active : style.idle
                  }`}
                >
                  <span>{CATEGORY_ICON[cat]}</span>
                  {cat}
                  {/* Badge showing count */}
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/30' : 'bg-gray-100'
                  }`}>
                    {mockReports.filter((r) => r.category === cat).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Map fills the remaining viewport height ── */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4">
        <div
          className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200"
          style={{ height: 'calc(100vh - 320px)', minHeight: '420px' }}
        >
          <ReportMap
            reports={mockReports}
            activeCategories={activeCategories}
          />
        </div>

        {/* ── Visible pin count ── */}
        <p className="mt-3 text-xs text-gray-400 text-center">
          Showing{' '}
          <strong className="text-gray-600">
            {mockReports.filter((r) => activeCategories.has(r.category)).length}
          </strong>{' '}
          of {mockReports.length} reports on map · Click any pin for details
        </p>
      </div>
    </div>
  );
}

