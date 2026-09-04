import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, ShieldCheck, List, MapPin, ThumbsUp, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (token) {
      fetch('http://localhost:5000/reports/user/my-reports', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setReports(data.reports || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, token, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Citizen
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
          </div>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          {t('navReportHazard')}
        </Link>
      </div>

      {/* User Reports Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('profileTitle')}</h2>
            <p className="text-sm text-gray-500">{t('profileSubtitle')}</p>
          </div>
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
            {reports.length} Reports
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 text-sm">Loading your reported items...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
            <List className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">{t('noUserReports')}</h3>
            <p className="text-sm text-gray-500 mb-4">Help make Sri Lankan roads safer by submitting your first report.</p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              {t('btnReportNow')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-base">{report.title}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      report.status === 'Open' ? 'bg-red-100 text-red-700' :
                      report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {report.status}
                    </span>
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {report.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </p>

                  <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>

                  {report.aiSummary && (
                    <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 italic mt-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{report.aiSummary}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 shrink-0">
                  <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                    <ThumbsUp className="w-3.5 h-3.5 text-orange-500" />
                    {report.upvotes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
