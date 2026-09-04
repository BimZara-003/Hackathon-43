/**
 * ReportMap.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * ISOLATED Leaflet + OpenStreetMap map component.
 * No API key required — uses free OSM tiles.
 *
 * Props:
 *   reports          – Report[] — the reports to show as pins
 *   activeCategories – Set<string> — only pins in this set are shown
 *
 * Design decisions (easy to explain in a live demo):
 * • Infrastructure reports → round circle pin, colour = severity
 * • Unsafe Area reports    → diamond-shaped pin, always purple
 * • Clicking a pin         → Popup with full report details
 * • Legend panel           → bottom-right corner of the map
 *
 * We use L.divIcon() (HTML string → custom marker) instead of the default
 * Leaflet PNG icons, so no image file setup is needed with Vite.
 */

import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
// Leaflet CSS is loaded via CDN link in index.html to prevent PostCSS bundling errors
// import 'leaflet/dist/leaflet.css';

// ─── Colour / icon helpers ─────────────────────────────────────────────────

/** Pin background colour by severity */
const SEVERITY_COLOR = {
  High:   '#EF4444', // red-500
  Medium: '#F59E0B', // amber-500
  Low:    '#22C55E', // green-500
};

/** Small emoji per category for round pins */
const CATEGORY_EMOJI = {
  Pothole:       '🕳️',
  Streetlight:   '💡',
  Drainage:      '💧',
  'Road Damage': '🚧',
  Other:         '📍',
};

/**
 * Creates a custom Leaflet DivIcon for a report.
 *
 * • Unsafe Area  → purple diamond (rotated square)
 * • Everything else → coloured circle with emoji
 */
function createMarkerIcon(report) {
  const isUnsafe = report.category === 'Unsafe Area';
  const color    = SEVERITY_COLOR[report.severity] || '#6B7280';
  const emoji    = CATEGORY_EMOJI[report.category] || '📍';

  if (isUnsafe) {
    // Diamond shape to visually distinguish safety reports from infra reports
    return L.divIcon({
      className: '', // clear leaflet's default class to avoid white box
      html: `
        <div style="
          width:28px;height:28px;
          background:#7C3AED;
          border:3px solid white;
          transform:rotate(45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
        ">
          <span style="transform:rotate(-45deg);font-size:10px;line-height:1;">⚠</span>
        </div>`,
      iconSize:    [28, 28],
      iconAnchor:  [14, 14],
      popupAnchor: [0, -16],
    });
  }

  // Circle pin for all infrastructure categories
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:32px;height:32px;
        background:${color};
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;
        font-size:14px;line-height:1;
      ">${emoji}</div>`,
    iconSize:    [32, 32],
    iconAnchor:  [16, 16],
    popupAnchor: [0, -18],
  });
}

// ─── Status badge (used inside Popup — plain inline styles, no Tailwind) ───

const STATUS_COLOR = {
  Open:          { bg: '#FEE2E2', text: '#B91C1C' },
  'In Progress': { bg: '#DBEAFE', text: '#1D4ED8' },
  Resolved:      { bg: '#DCFCE7', text: '#15803D' },
};

// ─── Auto-fit bounds when reports change ──────────────────────────────────

/**
 * Inner component that uses the Leaflet map instance to auto-fit visible pins.
 * Must be rendered inside <MapContainer> to access useMap().
 */
function FitBounds({ reports }) {
  const map = useMap();

  useEffect(() => {
    if (!reports.length) return;
    const bounds = L.latLngBounds(reports.map((r) => [r.lat, r.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [reports, map]);

  return null;
}

// ─── Legend ────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '10px',
        zIndex: 1000,
        background: 'white',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        fontSize: '11px',
        lineHeight: '1.8',
        minWidth: '170px',
      }}
    >
      <strong style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>
        Map Legend
      </strong>

      {/* Severity */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{ color: '#6B7280', fontWeight: 600, marginBottom: '2px' }}>Severity (circle colour)</div>
        {[
          { label: 'High',   color: '#EF4444' },
          { label: 'Medium', color: '#F59E0B' },
          { label: 'Low',    color: '#22C55E' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            {label}
          </div>
        ))}
      </div>

      {/* Shape */}
      <div>
        <div style={{ color: '#6B7280', fontWeight: 600, marginBottom: '2px' }}>Shape</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6B7280', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          Infrastructure hazard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 11, height: 11, background: '#7C3AED', transform: 'rotate(45deg)', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          &nbsp; Unsafe Area / Safety risk
        </div>
      </div>
    </div>
  );
}

// ─── Main exported component ───────────────────────────────────────────────

/**
 * ReportMap — drop-in Leaflet map.
 *
 * Usage:
 *   <ReportMap reports={filteredReports} activeCategories={new Set([...])} />
 */
export default function ReportMap({ reports, activeCategories }) {
  // Filter to only visible categories
  const visible = activeCategories
    ? reports.filter((r) => activeCategories.has(r.category))
    : reports;

  // Centre of Sri Lanka as fallback
  const SRI_LANKA_CENTER = [7.8731, 80.7718];

  return (
    // Relative container so our Legend can be positioned inside it
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <MapContainer
        center={SRI_LANKA_CENTER}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        // Disable zoom on scroll so the page can still scroll normally
        scrollWheelZoom={true}
      >
        {/* ── OpenStreetMap tile layer (no API key needed) ── */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ── Auto-fit to visible pins ── */}
        <FitBounds reports={visible} />

        {/* ── Report pins ── */}
        {visible.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={createMarkerIcon(report)}
          >
            <Popup maxWidth={260}>
              {/* Popup uses inline styles so Tailwind purge doesn't remove them */}
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>
                {/* Title */}
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px', color: '#111827' }}>
                  {report.title}
                </div>

                {/* Category + Status chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ background: '#F3F4F6', color: '#374151', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
                    {report.category}
                  </span>
                  <span style={{
                    background: STATUS_COLOR[report.status]?.bg,
                    color:      STATUS_COLOR[report.status]?.text,
                    padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                  }}>
                    {report.status}
                  </span>
                  <span style={{
                    background: report.severity === 'High' ? '#FEE2E2' : report.severity === 'Medium' ? '#FEF3C7' : '#DCFCE7',
                    color:      report.severity === 'High' ? '#B91C1C' : report.severity === 'Medium' ? '#92400E' : '#15803D',
                    padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                  }}>
                    {report.severity} severity
                  </span>
                </div>

                {/* Location */}
                <div style={{ color: '#6B7280', fontSize: '11px', marginBottom: '6px' }}>
                  📍 {report.location}
                </div>

                {/* Description */}
                <div style={{ color: '#374151', marginBottom: '8px' }}>
                  {report.description.length > 120
                    ? report.description.slice(0, 120) + '…'
                    : report.description}
                </div>

                {/* AI Summary */}
                {report.aiSummary && (
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', color: '#1D4ED8', fontStyle: 'italic' }}>
                    ✦ {report.aiSummary}
                  </div>
                )}

                {/* Upvotes */}
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#6B7280' }}>
                  👍 {report.upvotes} community {report.upvotes === 1 ? 'confirmation' : 'confirmations'}
                </div>

                {/* Emergency contacts for urgent/unsafe */}
                {(report.severity === 'High' || report.category === 'Unsafe Area') && (
                  <div style={{ marginTop: '8px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '6px 8px', fontSize: '11px' }}>
                    <div style={{ fontWeight: 700, color: '#B91C1C', marginBottom: '3px' }}>🚨 Emergency</div>
                    <div style={{ color: '#7F1D1D' }}>🚔 Police: 119 &nbsp;|&nbsp; 🚑 Ambulance: 110</div>
                    {report.category === 'Unsafe Area' && (
                      <div style={{ color: '#7F1D1D', marginTop: '2px' }}>👩‍⚕️ Women's Bureau: 1938</div>
                    )}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend overlay (outside MapContainer DOM but inside relative div) */}
      <Legend />
    </div>
  );
}

