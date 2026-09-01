import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  ShieldCheck,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  HeartHandshake,
  TrendingUp,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isCustomer, isWorker, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:rotate-6 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Seva<span className="text-emerald-600">Sangam</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Co-op
                </span>
              </div>
              <span className="text-[11px] text-slate-500 -mt-1 font-medium">
                Fair Wages • Transparent Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/services"
              className={`text-sm font-medium transition-colors ${
                isActive('/services')
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              All Services
            </Link>

            {/* Authenticated Links based on Role */}
            {isAuthenticated && isCustomer && (
              <Link
                to="/bookings"
                className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${
                  isActive('/bookings')
                    ? 'text-emerald-600 font-semibold'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </Link>
            )}

            {isAuthenticated && isWorker && (
              <Link
                to="/worker/dashboard"
                className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/worker/dashboard')
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span>Worker Portal</span>
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/admin/dashboard')
                    ? 'bg-emerald-900 text-white font-semibold'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Cooperative Admin</span>
              </Link>
            )}
          </div>

          {/* User Profile & Auth CTA (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600 capitalize">
                      {user?.role === 'worker' ? `${user?.category} Partner` : user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/register?role=worker"
                  className="text-xs font-semibold px-3 py-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Join as Worker</span>
                </Link>
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3.5 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
          >
            All Services
          </Link>

          {isAuthenticated ? (
            <>
              {isCustomer && (
                <Link
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
                >
                  My Bookings
                </Link>
              )}
              {isWorker && (
                <Link
                  to="/worker/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-emerald-700 bg-emerald-50 px-3 rounded-lg"
                >
                  Worker Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-white bg-slate-900 px-3 rounded-lg"
                >
                  Admin Transparency Portal
                </Link>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-slate-800">{user?.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-rose-600 font-medium px-3 py-1.5 rounded-lg bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/register?role=worker"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg"
              >
                Join as Skilled Worker
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
