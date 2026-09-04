import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{t('loginTitle')}</h2>
          <p className="text-sm text-gray-600 mt-1">{t('loginSubtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>{t('navLogin')}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-orange-600 hover:underline">
            {t('navRegister')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
