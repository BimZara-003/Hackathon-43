import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Map as MapIcon, ShieldAlert, Home, Info, List, Globe, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();

  const links = [
    { name: t('navHome'), path: '/', icon: Home },
    { name: t('navReportHazard'), path: '/report', icon: ShieldAlert },
    { name: t('navAllReports'), path: '/reports', icon: List },
    { name: t('navMapView'), path: '/map', icon: MapIcon },
    { name: t('navAbout'), path: '/about', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                MM
              </div>
              <span className="text-xl font-bold text-orange-600 tracking-tight">
                Mithuru<span className="text-emerald-600">Mawatha</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-500 hover:border-orange-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {link.name}
                </Link>
              );
            })}

            {/* Language Switcher Dropdown */}
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
              <Globe className="w-4 h-4 text-gray-500 mr-1.5" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="en">🇬🇧 EN</option>
                <option value="si">🇱🇰 SI (සිංහල)</option>
                <option value="ta">🇱🇰 TA (தமிழ்)</option>
              </select>
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title={t('navLogout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  to="/login"
                  className="inline-flex items-center text-xs font-semibold text-gray-700 hover:text-orange-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 px-3.5 py-1.5 rounded-full shadow-sm transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1" />
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center md:hidden gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-gray-100 text-xs font-bold text-gray-700 px-2 py-1 rounded-full border border-gray-300"
            >
              <option value="en">EN</option>
              <option value="si">SI</option>
              <option value="ta">TA</option>
            </select>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 bg-orange-50 rounded-lg"
                >
                  <User className="w-4 h-4 mr-2 text-orange-600" />
                  {user.name} ({t('navProfile')})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
