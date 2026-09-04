import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Map as MapIcon, ShieldAlert, Home, Info, List } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Report Hazard', path: '/report', icon: ShieldAlert },
    { name: 'All Reports', path: '/reports', icon: List },
    { name: 'Map View', path: '/map', icon: MapIcon },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-orange-600 tracking-tight">
                Mithuru<span className="text-emerald-600">Mawatha</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex sm:space-x-8 items-center">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-500 hover:border-orange-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
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
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 border-l-4 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
