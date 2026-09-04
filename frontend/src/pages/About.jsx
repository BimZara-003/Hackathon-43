import React from 'react';
import { ShieldCheck, HeartHandshake, Sparkles, PhoneCall, ShieldAlert, Users, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wider">
          Sri Lankan Road Safety Platform
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          {t('aboutTitle')}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {t('aboutSubtitle')}
        </p>
      </div>

      {/* Feature Card 1: Citizen Community Reporting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Direct Citizen Channel</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            In Sri Lankan towns and cities, potholes, broken streetlights, and damaged drains often go unreported for months because citizens lack a direct channel to municipal authorities. Mithuru Mawatha provides a structured platform with interactive map pins and real-time status tracking.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <img
            src="/assets/about_community_safety.png"
            alt="Sri Lankan Community Road Safety"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Feature Card 2: Women's & Vulnerable Group Safety Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 md:flex-row-reverse">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 order-last md:order-first">
          <img
            src="/assets/about_womens_safety.png"
            alt="Sri Lanka Women Safety Layer"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Women's Safety & Vulnerable Layer</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Women and vulnerable groups often encounter poorly lit or isolated streets at night without a way to warn others. Our dedicated safety layer lets citizens flag unlit or risky areas with time-of-day tags, helping commuters stay safe and authorities prioritize street lighting.
          </p>
        </div>
      </div>

      {/* Feature Card 3: AI-Assisted Triage & Municipal Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Smart AI Urgency Triage</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Powered by advanced LLM AI triage, Mithuru Mawatha analyzes citizen report descriptions upon submission. It automatically suggests the hazard category, assigns an urgency rating (Low / Medium / High), and generates a clean neutral summary to assist authorities in prioritizing repairs.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <img
            src="/assets/about_authority_action.png"
            alt="Road Authority Action and Repair"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Emergency Helplines Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <PhoneCall className="w-8 h-8 text-yellow-300 animate-bounce" />
          <div>
            <h3 className="text-2xl font-bold">{t('emergencyHelplines')} in Sri Lanka</h3>
            <p className="text-red-100 text-sm">Immediate assistance numbers for accidents, crime, and safety emergencies.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-black text-yellow-300">119</div>
            <div className="text-xs font-semibold mt-1">{t('police')}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-black text-yellow-300">110</div>
            <div className="text-xs font-semibold mt-1">{t('ambulance')}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-black text-yellow-300">1938</div>
            <div className="text-xs font-semibold mt-1">{t('womenBureau')}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-black text-yellow-300">1968</div>
            <div className="text-xs font-semibold mt-1">{t('rda')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
