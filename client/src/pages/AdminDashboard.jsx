import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import {
  TrendingUp,
  Percent,
  DollarSign,
  Users,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commissionInput, setCommissionInput] = useState('10');
  const [updatingCommission, setUpdatingCommission] = useState(false);
  const [commissionMsg, setCommissionMsg] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, workersRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/workers'),
        api.get(`/admin/bookings${bookingFilter !== 'all' ? `?status=${bookingFilter}` : ''}`),
      ]);

      if (dashRes.data.success) {
        setDashboardData(dashRes.data);
        setCommissionInput(String(dashRes.data.stats.commissionRate || 10));
      }
      if (workersRes.data.success) {
        setWorkers(workersRes.data.workers);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [bookingFilter]);

  const handleUpdateCommission = async (e) => {
    e.preventDefault();
    setUpdatingCommission(true);
    setCommissionMsg('');

    try {
      const res = await api.put('/admin/commission', { rate: Number(commissionInput) });
      if (res.data.success) {
        setCommissionMsg(`✅ Cooperative commission rate updated to ${res.data.commissionRate}%.`);
        setTimeout(() => setCommissionMsg(''), 4000);
        fetchAdminData();
      }
    } catch (err) {
      setCommissionMsg(`❌ ${err.response?.data?.message || 'Update failed.'}`);
    } finally {
      setUpdatingCommission(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Loading cooperative platform governance metrics...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const categoryStats = dashboardData?.categoryStats || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-emerald-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cooperative Governance & Audit Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Transparency Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time public cooperative metrics, fair wage audits, and fee controls.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Live Ledger</span>
        </button>
      </div>

      {/* Main Financial Transparency Overview Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-extrabold block">
              Cooperative Gross Settlement
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-white mt-1">
              ₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Across {stats.completedBookings || 0} completed community service tickets
            </span>
          </div>

          {/* Dynamic Commission Rate Config Form */}
          <form
            onSubmit={handleUpdateCommission}
            className="bg-slate-800/90 border border-slate-700/80 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-300">
                Co-op Admin Fee (%)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={commissionInput}
                onChange={(e) => setCommissionInput(e.target.value)}
                className="w-24 text-sm font-bold bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={updatingCommission}
              className="mt-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Fee</span>
            </button>
          </form>
        </div>

        {commissionMsg && (
          <div className="mb-6 p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs">
            {commissionMsg}
          </div>
        )}

        {/* 3 Pillars of Democratic Cooperative Split */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Worker Payouts */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-6 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Distributed to Workers (90%)
            </span>
            <div className="text-3xl font-extrabold text-white">
              ₹{stats.totalWorkerEarnings?.toLocaleString('en-IN') || 0}
            </div>
            <p className="text-xs text-slate-300">
              Direct take-home wages retained by local skilled tradespeople.
            </p>
          </div>

          {/* Platform Cooperative Pool */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Cooperative Pool (10%)
            </span>
            <div className="text-3xl font-extrabold text-white">
              ₹{stats.totalCommission?.toLocaleString('en-IN') || 0}
            </div>
            <p className="text-xs text-slate-400">
              Covers digital infrastructure, customer dispute protection & safety.
            </p>
          </div>

          {/* Average Ticket Size */}
          <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              Average Ticket Size
            </span>
            <div className="text-3xl font-extrabold text-white">
              ₹{stats.avgTicketSize || 0}
            </div>
            <p className="text-xs text-slate-400">
              Standardized fair pricing benchmark across service categories.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Activity Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase">Workers Registered</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalWorkers || 0}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">100% Background Verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase">Customer Base</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalCustomers || 0}</div>
          <span className="text-[10px] text-slate-500">Active households</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase">Total Bookings</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalBookings || 0}</div>
          <span className="text-[10px] text-slate-500">{stats.activeBookings || 0} active / scheduled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-xs font-bold uppercase">Services Catalog</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalServices || 0}</div>
          <span className="text-[10px] text-slate-500">Active trades</span>
        </div>
      </div>

      {/* Trade Category Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          Performance by Trade Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((cat) => (
            <div
              key={cat._id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 capitalize text-sm">
                  {cat._id.replace('-', ' ')}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  {cat.count} Jobs
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Total GMV:</span>
                <span className="font-bold text-slate-800">₹{cat.revenue}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700">
                <span>Worker Take-Home:</span>
                <span className="font-bold">₹{cat.workerEarnings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workers Earnings & Performance Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">
            Artisan Partners Directory & Payout Registry
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {workers.length} Registered Artisans
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Artisan</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Jobs Done</th>
                <th className="py-3.5 px-4 text-emerald-700">Total Take-Home (90%)</th>
                <th className="py-3.5 px-4">Co-op Dues (10%)</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {workers.map((w) => (
                <tr key={w._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{w.name}</div>
                    <div className="text-[10px] text-slate-400">{w.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-semibold">{w.category}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1">
                      <StarRating rating={w.avgRating} size={11} />
                      <span className="font-bold">{w.avgRating}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold">{w.totalJobsCompleted || 0}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                    ₹{w.totalEarnings?.toLocaleString('en-IN') || 0}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    ₹{w.totalCommissionPaid?.toLocaleString('en-IN') || 0}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        w.availability
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {w.availability ? 'Available' : 'Busy'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Bookings Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Master Service Ledger
          </h2>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-bold">Filter Status:</span>
            <select
              value={bookingFilter}
              onChange={(e) => setBookingFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Worker</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4 text-emerald-700">Worker Payout</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {b.service?.name}
                  </td>
                  <td className="py-3.5 px-4">{b.customer?.name}</td>
                  <td className="py-3.5 px-4 font-semibold">{b.worker?.name}</td>
                  <td className="py-3.5 px-4">
                    <div>{b.date}</div>
                    <div className="text-[10px] text-slate-400">{b.timeSlot}</div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    ₹{b.totalAmount}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    ₹{b.workerEarning}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        b.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : b.status === 'cancelled'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
