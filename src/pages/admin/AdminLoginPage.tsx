import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const { authReady, isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authReady && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const ok = await login(username, password);
      if (ok) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email/username or password.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2744] via-[#003580] to-[#1a5276] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white">
            <span className="text-2xl font-black">
              Lanka<span className="text-[#FFB700]">Trips</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/15 px-2 py-1 rounded text-[#FFB700]">
              Admin
            </span>
          </Link>
          <p className="text-blue-200 text-sm mt-3">Sign in to manage catalog content</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-5"
        >
          <div>
            <label htmlFor="admin-user" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email or username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="admin-user"
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]"
                placeholder="admin"
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-pass" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="admin-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !authReady}
            className="w-full py-3 bg-[#003580] text-white font-bold rounded-lg hover:bg-[#002560] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-xs text-center text-gray-500">
            With Firebase configured: use your <strong>Firebase Auth</strong> email and password. Without Firebase: demo{' '}
            <code className="bg-gray-100 px-1 rounded">admin</code> / <code className="bg-gray-100 px-1 rounded">admin</code>.
          </p>
        </form>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-white/80 hover:text-white underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
