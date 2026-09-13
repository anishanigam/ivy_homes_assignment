import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import api from '../services/api';
import {
  Home,
  Building2,
  KeyRound,
  Heart,
  LineChart,
  ShieldCheck,
  LogOut,
  UserCheck,
  ChevronDown,
  Activity,
  MapPin,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, login, demoAccounts, demoPassword } = useAuth();
  const { savedIds } = useSaved();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  // Health state
  const [healthData, setHealthData] = useState(null);
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  useEffect(() => {
    async function checkHealth() {
      try {
        const data = await api.getHealth();
        setHealthData(data);
      } catch (e) {
        console.warn('API health check failed:', e);
      }
    }
    checkHealth();
    // Re-check health every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Buy Homes', path: '/', icon: Home },
    { name: 'Rentals', path: '/rentals', icon: KeyRound },
    { name: 'New Projects', path: '/projects', icon: Building2 },
    { name: 'Saved', path: '/saved', icon: Heart, count: savedIds.size },
    { name: 'Market Insights', path: '/insights', icon: LineChart, badge: 'Truth Shield' },
  ];

  const handleSwitchAccount = async (email) => {
    setSwitching(true);
    setDropdownOpen(false);
    try {
      await login(email, demoPassword);
      navigate('/');
    } catch (err) {
      console.error('Account switch failed', err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-ivy-600 text-white flex items-center justify-center shadow-sm shadow-ivy-600/30 group-hover:bg-ivy-700 transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-warm-900 flex items-center gap-1.5">
                    Ivy Homes
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-ivy-100 text-ivy-800 font-medium">Mumbai</span>
                  </span>
                  <span className="text-[11px] text-warm-500 block -mt-0.5">Verified Property Portal</span>
                </div>
              </Link>

              {/* Server Health Badge (/health) */}
              <button
                onClick={() => setHealthModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 text-xs bg-warm-50 hover:bg-warm-100 text-warm-700 px-2.5 py-1 rounded-full border border-warm-200 transition-all cursor-pointer"
                title="Click to view GET /health diagnostic details"
              >
                <span className={`w-2 h-2 rounded-full ${healthData?.status === 'ok' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span className="font-semibold text-[11px]">
                  {healthData?.status === 'ok' ? 'API 200 OK' : 'Checking API...'}
                </span>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-ivy-50 text-ivy-900 font-semibold shadow-xs'
                        : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-ivy-700' : 'text-warm-500'}`} />
                    <span>{item.name}</span>
                    {item.count > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-ivy-600 text-white font-bold">
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl border border-warm-200 hover:border-warm-300 hover:bg-warm-50 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-ivy-100 text-ivy-800 flex items-center justify-center font-bold text-xs border border-ivy-200">
                      {user?.email?.[4] || 'U'}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs font-semibold text-warm-900 leading-tight">
                        {user?.email?.split('@')[0]}
                      </div>
                      <div className="text-[10px] text-ivy-700 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-ivy-500 inline-block animate-pulse"></span>
                        Auto-refreshing session
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-warm-400" />
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-warm-200 p-2 z-50">
                      <div className="px-3 py-2 border-b border-warm-100">
                        <p className="text-xs text-warm-500">Signed in as</p>
                        <p className="text-sm font-semibold text-warm-900 truncate">{user?.email}</p>
                        <div className="mt-1 flex items-center text-[11px] text-warm-600 gap-1">
                          <Clock className="w-3 h-3 text-ivy-600" />
                          <span>Background Token Refresh Active</span>
                        </div>
                      </div>

                      <div className="py-2">
                        <p className="px-3 text-[11px] font-semibold text-warm-400 uppercase tracking-wider mb-1">
                          Switch Demo Account
                        </p>
                        {demoAccounts.map((acc) => (
                          <button
                            key={acc.email}
                            onClick={() => handleSwitchAccount(acc.email)}
                            disabled={switching || user?.email === acc.email}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              user?.email === acc.email
                                ? 'bg-ivy-50 text-ivy-900 font-semibold'
                                : 'hover:bg-warm-100 text-warm-700'
                            }`}
                          >
                            <div>
                              <span className="block font-medium">{acc.name}</span>
                              <span className="text-[10px] text-warm-500">{acc.email}</span>
                            </div>
                            {user?.email === acc.email && (
                              <UserCheck className="w-4 h-4 text-ivy-600" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-warm-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-ivy-600 text-white hover:bg-ivy-700 shadow-sm transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="lg:hidden border-t border-warm-200 bg-white px-2 py-1.5 flex items-center justify-around text-xs">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-1 px-2 rounded-lg ${
                  active ? 'text-ivy-700 font-semibold' : 'text-warm-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Health Modal (/health diagnostic popup) */}
      {healthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-warm-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-warm-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-warm-900 text-sm">Server Health Diagnostic</h3>
                  <code className="text-[11px] text-warm-500 font-mono">GET /health</code>
                </div>
              </div>
              <button
                onClick={() => setHealthModalOpen(false)}
                className="p-1 rounded-lg hover:bg-warm-100 text-warm-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-warm-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-warm-500">Service Status:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {healthData?.status || 'ok'}
                </span>
              </div>

              <div className="bg-warm-50 p-3 rounded-xl flex items-center justify-between">
                <span className="text-warm-500">Timezone:</span>
                <span className="font-mono font-semibold text-warm-900">{healthData?.timezone || 'Asia/Kolkata'}</span>
              </div>

              <div className="bg-warm-50 p-3 rounded-xl">
                <span className="text-warm-500 block mb-0.5">Live Server Clock (IST):</span>
                <span className="font-mono font-bold text-warm-900 block truncate">
                  {healthData?.server_time || '2026-09-14T00:52:15+05:30'}
                </span>
              </div>

              <div className="bg-warm-50 p-3 rounded-xl">
                <span className="text-warm-500 block mb-0.5">Anchored Reference Date:</span>
                <span className="font-mono font-bold text-ivy-800 block">
                  {healthData?.reference_date || '2026-09-10T00:00:00+05:30'}
                </span>
                <span className="text-[10px] text-warm-400 mt-1 block">
                  (Used for calculating listings posted in last 7 days)
                </span>
              </div>
            </div>

            <button
              onClick={() => setHealthModalOpen(false)}
              className="w-full py-2 bg-warm-100 hover:bg-warm-200 text-warm-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Close Diagnostic
            </button>
          </div>
        </div>
      )}
    </>
  );
}