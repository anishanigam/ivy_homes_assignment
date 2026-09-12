import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, KeyRound, ShieldCheck, ArrowRight, UserCheck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, demoAccounts, demoPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState(demoPassword);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = async (accEmail) => {
    setEmail(accEmail);
    setError(null);
    try {
      await login(accEmail, demoPassword);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-warm-200 p-8 shadow-sm">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-ivy-600 text-white mx-auto flex items-center justify-center mb-3 shadow-md shadow-ivy-600/20">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-warm-900 tracking-tight">Sign In to Ivy Homes</h2>
          <p className="text-xs text-warm-500 mt-1">Real credentials against the live auth flow</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* 1-Click Quick Demo Switcher */}
        <div className="mb-6 bg-warm-50 p-3.5 rounded-2xl border border-warm-200">
          <p className="text-[11px] font-semibold text-warm-400 uppercase tracking-wider mb-2">
            1-Click Demo Login
          </p>
          <div className="space-y-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickLogin(acc.email)}
                disabled={loading}
                className="w-full text-left px-3 py-2 rounded-xl text-xs bg-white border border-warm-200 hover:border-ivy-300 hover:bg-ivy-50/50 flex items-center justify-between transition-all"
              >
                <div>
                  <span className="font-semibold text-warm-900 block">{acc.name}</span>
                  <span className="text-[10px] text-warm-400">{acc.email}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-ivy-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Manual form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-warm-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-warm-50 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ivy-500/20 focus:border-ivy-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-warm-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-warm-50 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ivy-500/20 focus:border-ivy-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-ivy-600 hover:bg-ivy-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-warm-100 text-center">
          <p className="text-[11px] text-warm-400">
            Session survives reload · Background refresh active &gt; 30 mins
          </p>
        </div>
      </div>
    </div>
  );
}