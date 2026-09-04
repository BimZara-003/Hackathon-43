/**
 * AllReports.jsx — "All Reports" page
 * ─────────────────────────────────────────────────────────────────────────────
 * Features:
 *  ✅ Search bar — filters by keyword in title + description
 *  ✅ Category filter dropdown
 *  ✅ Status filter  (Open / In Progress / Resolved)
 *  ✅ Sort control   (Newest first / Most severe first)
 *  ✅ Status badges  (red=Open, blue=In Progress, green=Resolved)
 *  ✅ Status advance button per card (Open→InProgress→Resolved)
 *  ✅ Upvote / community confirm button per card
 *  ✅ Report abuse/spam button per card
 *  ✅ Urgent cards (High severity OR Unsafe Area) always shown first
 *     with red border + URGENT badge + emergency contacts block
 *  ✅ List ↔ Map toggle at the top (navigates to /map)
 *  ✅ Result count summary
 *  ✅ Empty state when no reports match filters
 *
 * State management: local useState — swap for context/API later by
 * replacing the initial useState(mockReports) call.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Map as MapIcon,
  List, X, AlertTriangle,
} from 'lucide-react';

import { mockReports, CATEGORIES, STATUSES, nextStatus } from '../data/mockReports';
import ReportCard from '../components/ReportCard';

// ─── Severity sort order ───────────────────────────────────────────────────
const SEVERITY_RANK = { High: 3, Medium: 2, Low: 1 };

// ─── Component ─────────────────────────────────────────────────────────────

export default function AllReports() {
  const navigate = useNavigate();

  // ── Data state (initialised from mock; mutations update local state) ──
  const [reports, setReports] = useState(
    // Deep-clone so mutations don't affect the original module-level array
    () => mockReports.map((r) => ({ ...r }))
  );

  // ── Filter + sort state ──
  const [search,         setSearch]         = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter,   setStatusFilter]   = useState('');
  const [sortBy,         setSortBy]         = useState('newest'); // 'newest' | 'severity'

  // ── Toast notification state ──
  const [toast, setToast] = useState(null);

  // ─── Action handlers ─────────────────────────────────────────────────────

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleUpvote(id) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  }

  function handleStatusAdvance(id) {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = nextStatus(r.status);
        showToast(`Status updated to "${next}"`);
        return { ...r, status: next };
      })
    );
  }

  function handleFlagSpam(id) {
    showToast('Report flagged for review — thank you.');
  }

  function clearFilters() {
    setSearch('');
    setCategoryFilter('');
    setStatusFilter('');
    setSortBy('newest');
  }

  // ─── Derived / filtered list ─────────────────────────────────────────────

  const filteredReports = useMemo(() => {
    let list = [...reports];

    // 1. Keyword search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (categoryFilter) {
      list = list.filter((r) => r.category === categoryFilter);
    }

    // 3. Status filter
    if (statusFilter) {
      list = list.filter((r) => r.status === statusFilter);
    }

    // 4. Sort — urgent reports always bubble to the top, then apply sort
    const isUrgent = (r) => r.severity === 'High' || r.category === 'Unsafe Area';

    const sortFn =
      sortBy === 'severity'
        ? (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]
        : (a, b) => new Date(b.createdAt) - new Date(a.createdAt); // newest first

    const urgent  = list.filter(isUrgent).sort(sortFn);
    const normal  = list.filter((r) => !isUrgent(r)).sort(sortFn);

    return [...urgent, ...normal];
  }, [reports, search, categoryFilter, statusFilter, sortBy]);

  // ─── Stats summary for the top bar ──────────────────────────────────────
  const stats = useMemo(() => ({
    open:       reports.filter((r) => r.status === 'Open').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved:   reports.filter((r) => r.status === 'Resolved').length,
  }), [reports]);

  const hasActiveFilters = search || categoryFilter || statusFilter || sortBy !== 'newest';

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-orange-50 pb-16">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">

          {/* Title row + View toggle */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Reports</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Community hazard and safety reports across Sri Lanka
              </p>
            </div>

            {/* List ↔ Map toggle */}
            <div className="flex rounded-xl overflow-hidden border border-orange-200 shadow-sm">
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-600 text-white"
                aria-current="page"
              >
                <List className="w-4 h-4" /> List
              </button>
              <button
                onClick={() => navigate('/map')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 transition-colors"
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
            </div>
          </div>

          {/* Status mini-stats */}
          <div className="mt-4 flex gap-3 flex-wrap text-sm">
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
              {stats.open} Open
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              {stats.inProgress} In Progress
            </span>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">
              {stats.resolved} Resolved
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* ── Search bar ── */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title, description, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Filter + sort row ── */}
        <div className="flex flex-wrap gap-2 items-center">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 min-w-[130px] px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
          >
            <option value="newest">Newest first</option>
            <option value="severity">Most severe first</option>
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-red-500 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* ── Result count ── */}
        <p className="text-sm text-gray-500">
          Showing <strong className="text-gray-700">{filteredReports.length}</strong> of{' '}
          {reports.length} reports
          {hasActiveFilters && ' (filtered)'}
        </p>

        {/* ── Report cards list ── */}
        {filteredReports.length === 0 ? (
          // Empty state
          <div className="text-center py-16 text-gray-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No reports match your filters.</p>
            <p className="text-sm mt-1">Try adjusting the search or filter settings.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-orange-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onUpvote={handleUpvote}
                onStatusAdvance={handleStatusAdvance}
                onFlagSpam={handleFlagSpam}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50 animate-bounce-once">
          {toast}
        </div>
      )}
    </div>
  );
}

