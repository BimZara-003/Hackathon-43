import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const SEVERITY_COLOR = {
  High: '#EF4444',
  Medium: '#F59E0B',
  Low: '#22C55E',
};

const CATEGORY_EMOJI = {
  Pothole: '🕳️',
  Streetlight: '💡',
  Drainage: '💧',
  'Road Damage': '🚧',
  'Unsafe Area': '🛡️',
  Other: '📍',
};

function createMarkerIcon(report) {
  const isUnsafe = report.category === 'Unsafe Area';
  const color = SEVERITY_COLOR[report.severity] || '#6B7280';
  const emoji = CATEGORY_EMOJI[report.category] || '📍';

  if (isUnsafe) {
    return L.divIcon({
      className: '',
      html: `
        <div style="
          width:28px;height:28px;
          background:#7C3AED;
          border:3px solid white;
          transform:rotate(45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
        ">
          <span style="transform:rotate(-45deg);font-size:10px;line-height:1;color:white;font-weight:bold;">⚠</span>
        </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });
  }

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
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function createPopupContent(report) {
  const statusBg =
    report.status === 'Open' ? '#FEE2E2' : report.status === 'In Progress' ? '#DBEAFE' : '#DCFCE7';
  const statusText =
    report.status === 'Open' ? '#B91C1C' : report.status === 'In Progress' ? '#1D4ED8' : '#15803D';

  const sevBg =
    report.severity === 'High' ? '#FEE2E2' : report.severity === 'Medium' ? '#FEF3C7' : '#DCFCE7';
  const sevText =
    report.severity === 'High' ? '#B91C1C' : report.severity === 'Medium' ? '#92400E' : '#15803D';

  return `
    <div style="font-family: system-ui, sans-serif; font-size: 13px; line-height: 1.5; padding: 4px;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px; color: #111827;">
        ${report.title}
      </div>

      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
        <span style="background: #F3F4F6; color: #374151; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;">
          ${report.category}
        </span>
        <span style="background: ${statusBg}; color: ${statusText}; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;">
          ${report.status}
        </span>
        <span style="background: ${sevBg}; color: ${sevText}; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;">
          ${report.severity} severity
        </span>
      </div>

      <div style="color: #6B7280; font-size: 11px; margin-bottom: 6px;">
        📍 ${report.location}
      </div>

      <div style="color: #374151; margin-bottom: 8px;">
        ${report.description.length > 120 ? report.description.slice(0, 120) + '…' : report.description}
      </div>

      ${
        report.aiSummary
          ? `<div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 6px 8px; font-size: 11px; color: #1D4ED8; font-style: italic;">
              ✦ ${report.aiSummary}
            </div>`
          : ''
      }

      <div style="margin-top: 8px; font-size: 11px; color: #6B7280;">
        👍 ${report.upvotes || 0} community confirmations
      </div>

      ${
        report.severity === 'High' || report.category === 'Unsafe Area'
          ? `<div style="margin-top: 8px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 6px; padding: 6px 8px; font-size: 11px;">
              <div style="font-weight: 700; color: #B91C1C; margin-bottom: 3px;">🚨 Emergency Contacts</div>
              <div style="color: #7F1D1D;">🚔 Police: 119 &nbsp;|&nbsp; 🚑 Ambulance: 110</div>
              ${
                report.category === 'Unsafe Area'
                  ? `<div style="color: #7F1D1D; margin-top: 2px;">👩‍⚕️ Women's Bureau: 1938</div>`
                  : ''
              }
            </div>`
          : ''
      }
    </div>
  `;
}

export default function ReportMap({ reports = [], activeCategories }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const layerGroupRef = useRef(null);

  const SRI_LANKA_CENTER = [7.8731, 80.7718];

  // Initialize Leaflet Map ONCE
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SRI_LANKA_CENTER,
      zoom: 8,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update Markers whenever reports or activeCategories change
  useEffect(() => {
    if (!leafletMapRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    if (!Array.isArray(reports) || reports.length === 0) return;

    const visible = reports
      .filter((r) => r && (activeCategories ? activeCategories.has(r.category) : true))
      .map((r) => ({
        ...r,
        lat: Number(r.lat) || 6.9271,
        lng: Number(r.lng) || 79.8612,
        title: r.title || 'Untitled Hazard Report',
        description: r.description || 'No description provided.',
        category: r.category || 'Other',
        severity: r.severity || 'Medium',
        status: r.status || 'Open',
        location: r.location || 'Sri Lanka',
      }));

    if (visible.length === 0) return;

    const bounds = [];

    visible.forEach((report) => {
      const marker = L.marker([report.lat, report.lng], {
        icon: createMarkerIcon(report),
      });

      marker.bindPopup(createPopupContent(report), { maxWidth: 260 });
      layerGroup.addLayer(marker);
      bounds.push([report.lat, report.lng]);
    });

    if (bounds.length > 0) {
      try {
        leafletMapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      } catch (err) {
        console.warn('fitBounds error:', err);
      }
    }
  }, [reports, activeCategories]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden min-h-[420px]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-0" />

      {/* Map Legend Overlay */}
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

        <div style={{ marginBottom: '6px' }}>
          <div style={{ color: '#6B7280', fontWeight: 600, marginBottom: '2px' }}>Severity</div>
          {[
            { label: 'High', color: '#EF4444' },
            { label: 'Medium', color: '#F59E0B' },
            { label: 'Low', color: '#22C55E' },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: 'flex', items: 'center', gap: '6px' }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: color,
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
              {label}
            </div>
          ))}
        </div>

        <div>
          <div style={{ color: '#6B7280', fontWeight: 600, marginBottom: '2px' }}>Shape</div>
          <div style={{ display: 'flex', items: 'center', gap: '6px' }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#6B7280',
                border: '2px solid white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
            Infrastructure hazard
          </div>
          <div style={{ display: 'flex', items: 'center', gap: '6px' }}>
            <div
              style={{
                width: 11,
                height: 11,
                background: '#7C3AED',
                transform: 'rotate(45deg)',
                border: '2px solid white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
            &nbsp; Unsafe Area / Safety risk
          </div>
        </div>
      </div>
    </div>
  );
}
