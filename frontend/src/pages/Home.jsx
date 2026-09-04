import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, CheckCircle, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-orange-50 min-h-screen pb-12">
      {/* Hero Section */}
      <section className="bg-white rounded-b-[3rem] shadow-sm mb-12 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            AI-Powered Sri Lankan Community Safety Platform
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/report"
              className="px-8 py-3.5 w-full sm:w-auto text-base font-bold rounded-full text-white bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all"
            >
              {t('btnReportNow')}
            </Link>
            <Link
              to="/map"
              className="px-8 py-3.5 w-full sm:w-auto text-base font-bold rounded-full text-orange-700 bg-orange-100 hover:bg-orange-200 transition-all flex items-center justify-center"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {t('btnExploreMap')}
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">How Mithuru Mawatha Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Report with AI Triage</h3>
            <p className="text-gray-600 text-sm">Spot a road defect or dark unsafe area? Describe it and let AI suggest urgency and category automatically.</p>
          </div>
          
          {/* Arrow 1 */}
          <div className="hidden md:block absolute top-1/2 left-1/3 transform -translate-y-1/2 -translate-x-1/2 z-0 text-gray-300">
             <ArrowRight className="w-8 h-8" />
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-500">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Live Community Tracking</h3>
            <p className="text-gray-600 text-sm">Upvote local issues and track real-time verification and priority triage by municipal authorities.</p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:block absolute top-1/2 left-2/3 transform -translate-y-1/2 -translate-x-1/2 z-0 text-gray-300">
             <ArrowRight className="w-8 h-8" />
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-500">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Rapid Resolution</h3>
            <p className="text-gray-600 text-sm">Once resolved by authorities or RDA teams, the report is verified fixed for all commuters.</p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-700 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-64 h-64 rounded-full bg-emerald-600 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-48 h-48 rounded-full bg-emerald-800 opacity-50 blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-center mb-8">Sri Lanka Community Safety Impact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl font-extrabold mb-1">1,245</div>
                <div className="text-emerald-100 text-xs uppercase tracking-wider font-semibold">{t('statTotal')}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl font-extrabold mb-1 text-red-200">312</div>
                <div className="text-emerald-100 text-xs uppercase tracking-wider font-semibold">{t('statOpen')}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl font-extrabold mb-1 text-green-300">933</div>
                <div className="text-emerald-100 text-xs uppercase tracking-wider font-semibold">{t('statResolved')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
