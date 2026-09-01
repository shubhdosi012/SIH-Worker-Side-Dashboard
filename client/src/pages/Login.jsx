import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res?.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res?.user?.role === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate(redirectPath === '/login' ? '/' : redirectPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Demo Login helper
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-mesh">
      <div className="max-w-md w-full space-y-6">
        {/* Form Container */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-slate-200/80">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/20">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back to SevaSangam
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to access your cooperative account and bookings.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-3">
              ⚡ Quick One-Click Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('rahul@example.com', 'password123')
                }
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-xs"
              >
                <div className="font-bold text-slate-800">👤 Customer</div>
                <div className="text-[10px] text-slate-500">Rahul Sharma</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('ramesh.plumber@example.com', 'password123')
                }
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-xs"
              >
                <div className="font-bold text-slate-800">🔧 Worker (Plumber)</div>
                <div className="text-[10px] text-slate-500">Ramesh Kumar</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('priya.electrician@example.com', 'password123')
                }
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-xs"
              >
                <div className="font-bold text-slate-800">⚡ Worker (Electrician)</div>
                <div className="text-[10px] text-slate-500">Priya Sharma</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin('admin@sevasangam.org', 'password123')
                }
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-xs"
              >
                <div className="font-bold text-slate-800">👑 Co-op Admin</div>
                <div className="text-[10px] text-slate-500">Platform Transparency</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="text-emerald-700 font-bold hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
