/**
 * ReportCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays a single hazard / safety report in a card format.
 *
 * Props:
 *   report        – Report object (see mockReports.js for shape)
 *   onUpvote      – (id: string) => void  – called when user upvotes
 *   onStatusAdvance – (id: string) => void – advance Open→InProgress→Resolved
 *   onFlagSpam    – (id: string) => void  – mark as spam/abuse
 */

import React from 'react';
import {
  ThumbsUp,
  ArrowRight,
  Flag,
  Clock,
  MapPin,
  Zap,
  ShieldAlert,
  Phone,
} from 'lucide-react';
import { nextStatus } from '../data/mockReports';

// ─── Colour / label helpers ────────────────────────────────────────────────

/** Tailwind classes for status badges */
const STATUS_BADGE = {
  Open:        'bg-red-100 text-red-700 border border-red-200',
  'In Progress': 'bg-blue-100 text-blue-700 border border-blue-200',
  Resolved:    'bg-green-100 text-green-700 border border-green-200',
};

/** Left-border accent colour by severity */
const SEVERITY_BORDER = {
  High:   'border-l-red-500',
  Medium: 'border-l-amber-400',
  Low:    'border-l-green-500',
};

/** Small pill colours for category badges */
const CATEGORY_PILL = {
  Pothole:       'bg-orange-100 text-orange-700',
  Streetlight:   'bg-yellow-100 text-yellow-700',
  Drainage:      'bg-cyan-100 text-cyan-700',
  'Road Damage': 'bg-red-100 text-red-700',
  'Unsafe Area': 'bg-purple-100 text-purple-800',
  Other:         'bg-gray-100 text-gray-600',
};

/** Category icons (emoji kept small and consistent) */
const CATEGORY_ICON = {
  Pothole:       '🕳️',
  Streetlight:   '💡',
  Drainage:      '💧',
  'Road Damage': '🚧',
  'Unsafe Area': '🛡️',
  Other:         '📍',
};

/** Human-readable relative time */
function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Emergency contact block ───────────────────────────────────────────────

/**
 * Shown on any High-severity report OR any "Unsafe Area" report.
 * Unsafe Area also shows the Women & Children's Bureau hotline.
 */
function EmergencyContacts({ category, severity }) {
  const show = severity === 'High' || category === 'Unsafe Area';
  if (!show) return null;

  return (
    <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
      <p className="text-xs font-semibold text-red-700 mb-1.5 flex items-center gap-1">
        <Phone className="w-3 h-3" /> Emergency Contacts
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-red-800">
        <span>🚔 Police — <strong>119</strong></span>
        <span>🚑 Ambulance — <strong>110</strong></span>
        {category === 'Unsafe Area' && (
          <span>👩‍⚕️ Women &amp; Children's Bureau — <strong>1938</strong></span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ReportCard({ report, onUpvote, onStatusAdvance, onFlagSpam }) {
  const {
    id, title, description, category, location,
    severity, status, isAnonymous, timeOfDay,
    aiSummary, upvotes, createdAt,
  } = report;

  const isUrgent    = severity === 'High' || category === 'Unsafe Area';
  const isSafetyReport = category === 'Unsafe Area';
  const canAdvance  = status !== 'Resolved';

  // Outer card border: purple for safety, otherwise severity colour
  const borderClass = isSafetyReport
    ? 'border-l-purple-500'
    : SEVERITY_BORDER[severity] || 'border-l-gray-300';

  // Extra highlight ring for urgent reports
  const urgentRing = isUrgent
    ? 'ring-1 ring-red-200 shadow-red-100 shadow-md'
    : 'shadow-sm';

  return (
    <article
      className={`bg-white rounded-2xl border-l-4 ${borderClass} ${urgentRing} p-4 sm:p-5 transition-shadow hover:shadow-md`}
    >
      {/* ── Row 1: Title + Urgent badge + Status ── */}
      <div className="flex items-start gap-2 flex-wrap">
        {isUrgent && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white shrink-0">
            <Zap className="w-3 h-3" /> URGENT
          </span>
        )}

        <h3 className="flex-1 font-semibold text-gray-900 text-base leading-snug min-w-0">
          {title}
          {isAnonymous && (
            <span className="ml-2 text-xs text-gray-400 font-normal">(anonymous)</span>
          )}
        </h3>

        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[status]}`}>
          {status}
        </span>
      </div>

      {/* ── Row 2: Meta chips ── */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${CATEGORY_PILL[category]}`}>
          {CATEGORY_ICON[category]} {category}
        </span>

        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {location}
        </span>

        {/* Severity pill */}
        <span
          className={`px-2 py-0.5 rounded-full font-semibold border text-xs ${
            severity === 'High'
              ? 'border-red-300 text-red-600 bg-red-50'
              : severity === 'Medium'
              ? 'border-amber-300 text-amber-600 bg-amber-50'
              : 'border-green-300 text-green-600 bg-green-50'
          }`}
        >
          {severity}
        </span>

        {/* Time-of-day tag for safety reports */}
        {timeOfDay && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-medium">
            <Clock className="w-3 h-3" /> {timeOfDay}
          </span>
        )}
      </div>

      {/* ── AI Summary ── */}
      {aiSummary && (
        <p className="mt-3 text-xs italic text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          ✦ AI Triage: {aiSummary}
        </p>
      )}

      {/* ── Description ── */}
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>

      {/* ── Emergency contacts ── */}
      <EmergencyContacts category={category} severity={severity} />

      {/* ── Footer: timestamp + actions ── */}
      <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {timeAgo(createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {/* Upvote / community confirm */}
          <button
            onClick={() => onUpvote(id)}
            title={isSafetyReport ? 'Confirm this safety concern' : 'Upvote this report'}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              isSafetyReport
                ? 'border-purple-300 text-purple-700 hover:bg-purple-50'
                : 'border-orange-300 text-orange-700 hover:bg-orange-50'
            }`}
          >
            {isSafetyReport ? (
              <ShieldAlert className="w-3.5 h-3.5" />
            ) : (
              <ThumbsUp className="w-3.5 h-3.5" />
            )}
            {upvotes}
          </button>

          {/* Advance status */}
          {canAdvance && (
            <button
              onClick={() => onStatusAdvance(id)}
              title={`Mark as "${nextStatus(status)}"`}
              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              {nextStatus(status)}
            </button>
          )}

          {/* Report abuse/spam */}
          <button
            onClick={() => onFlagSpam(id)}
            title="Report as spam or abuse"
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

