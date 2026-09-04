import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, CheckCircle, ArrowRight, MapPin } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-orange-50 min-h-screen pb-12">
      {/* Hero Section */}
      <section className="bg-white rounded-b-[3rem] shadow-sm mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Building a <span className="text-emerald-600">Safer</span> Sri Lanka Together
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Mithuru Mawatha (Friendly Road) is a community hazard and safety reporting platform. Report potholes, broken lights, and unsafe areas to help authorities and citizens stay informed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/report"
              className="px-8 py-3 w-full sm:w-auto text-lg font-medium rounded-full text-white bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all"
            >
              Report a Hazard
            </Link>
            <Link
              to="/map"
              className="px-8 py-3 w-full sm:w-auto text-lg font-medium rounded-full text-orange-700 bg-orange-100 hover:bg-orange-200 transition-all flex items-center justify-center"
            >
              <MapPin className="w-5 h-5 mr-2" />
              View Map
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Report</h3>
            <p className="text-gray-600">Spot a road hazard or unsafe area? Report it quickly with our simple form and AI triage.</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Track</h3>
            <p className="text-gray-600">The community can upvote reports, and authorities are notified. Track status updates live.</p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:block absolute top-1/2 left-2/3 transform -translate-y-1/2 -translate-x-1/2 z-0 text-gray-300">
             <ArrowRight className="w-8 h-8" />
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-emerald-500">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Resolved</h3>
            <p className="text-gray-600">Once fixed by authorities, the issue is marked resolved, making our roads safer for everyone.</p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-700 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-64 h-64 rounded-full bg-emerald-600 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-48 h-48 rounded-full bg-emerald-800 opacity-50 blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-center mb-8">Our Impact This Month</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl font-extrabold mb-1">1,245</div>
                <div className="text-emerald-100 text-sm uppercase tracking-wider font-semibold">Total Reports</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl font-extrabold mb-1 text-red-200">312</div>
                <div className="text-emerald-100 text-sm uppercase tracking-wider font-semibold">Open Issues</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-4xl font-extrabold mb-1 text-green-300">933</div>
                <div className="text-emerald-100 text-sm uppercase tracking-wider font-semibold">Hazards Resolved</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
