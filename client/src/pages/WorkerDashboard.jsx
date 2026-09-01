import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import {
  Wrench,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Power,
  DollarSign,
  Percent,
  PlayCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

const WorkerDashboard = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchWorkerBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
      await refreshUser();
    } catch (err) {
      console.error('Error fetching worker bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerBookings();
  }, []);

  const handleToggleAvailability = async () => {
    setUpdatingAvailability(true);
    try {
      await updateProfile({ availability: !user?.availability });
    } catch (err) {
      alert('Failed to update availability status.');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        await fetchWorkerBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Group bookings
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const activeBookings = bookings.filter((b) =>
    ['accepted', 'in-progress'].includes(b.status)
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 font-extrabold text-2xl flex items-center justify-center border border-emerald-400/30">
            {user?.name?.charAt(0) || 'W'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white">
                {user?.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase">
                {user?.category} Specialist
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Cooperative Artisan Partner • {user?.location || 'Indore'}
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center space-x-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Duty Status
            </span>
            <span
              className={`text-xs font-bold ${
                user?.availability ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {user?.availability ? '● Available for Jobs' : '○ Off Duty / Busy'}
            </span>
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={updatingAvailability}
            className={`p-2.5 rounded-xl font-bold text-xs transition-all ${
              user?.availability
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Worker Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Take-Home Earnings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">
              Net Take-Home Pay (90%)
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{user?.totalEarnings || 0}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            Direct customer cash/UPI settlement
          </span>
        </div>

        {/* Jobs Completed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">
              Jobs Completed
            </span>
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {user?.totalJobsCompleted || 0}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Verified household appointments
          </span>
        </div>

        {/* Cooperative Dues Contributed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">
              Co-op Pool (10% Dues)
            </span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{user?.totalCommissionPaid || 0}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Supports platform ops & insurance
          </span>
        </div>

        {/* Reputation Rating */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">
              Reputation Score
            </span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {Number(user?.avgRating || 5).toFixed(1)}
            </span>
            <StarRating rating={user?.avgRating || 5} size={14} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            From {user?.totalReviews || 0} client reviews
          </span>
        </div>
      </div>

      {/* Pending & Incoming Job Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Incoming Job Requests</span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              {pendingBookings.length}
            </span>
          </h2>
          <button
            onClick={fetchWorkerBookings}
            className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {pendingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-3xl border-2 border-amber-300/80 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
                      New Booking Request
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {b.service?.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 block">
                      ₹{b.totalAmount}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Earn: ₹{b.workerEarning}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {b.date} • {b.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {b.address?.street}, {b.address?.city}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Client: {b.customer?.name} ({b.customer?.phone})</span>
                  </div>
                  {b.notes && (
                    <p className="pt-1 italic text-slate-500">
                      Note: "{b.notes}"
                    </p>
                  )}
                </div>

                {/* Accept / Reject Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleUpdateStatus(b._id, 'rejected')}
                    disabled={actionLoadingId === b._id}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(b._id, 'accepted')}
                    disabled={actionLoadingId === b._id}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Accept Job (₹{b.workerEarning})
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-xs text-slate-500">
            No pending incoming booking requests at the moment. Keep availability ON to receive customer leads.
          </div>
        )}
      </div>

      {/* In-Progress / Scheduled Jobs */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <span>Active & Scheduled Jobs</span>
          <span className="text-xs bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-bold">
            {activeBookings.length}
          </span>
        </h2>

        {activeBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">
                      Status: {b.status}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {b.service?.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Payout: ₹{b.workerEarning}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                  <div>
                    <strong>Date & Time:</strong> {b.date} • {b.timeSlot}
                  </div>
                  <div>
                    <strong>Client Address:</strong> {b.address?.street}, {b.address?.city}
                  </div>
                  <div>
                    <strong>Client Contact:</strong> {b.customer?.name} ({b.customer?.phone})
                  </div>
                </div>

                {/* Workflow transitions */}
                <div className="pt-2 flex items-center space-x-2">
                  {b.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'in-progress')}
                      disabled={actionLoadingId === b._id}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Start Work (Mark In-Progress)</span>
                    </button>
                  )}

                  {b.status === 'in-progress' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'completed')}
                      disabled={actionLoadingId === b._id}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Job Completed & Collect ₹{b.totalAmount}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-xs text-slate-500">
            No active jobs in progress.
          </div>
        )}
      </div>

      {/* Completed Job History Ledger */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          Completed Job Ledger & Earnings
        </h2>

        {completedBookings.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Total Paid</th>
                    <th className="py-3.5 px-4">Co-op Fee (10%)</th>
                    <th className="py-3.5 px-4 text-emerald-700">Net Take-Home (90%)</th>
                    <th className="py-3.5 px-4">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {completedBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {b.service?.name}
                      </td>
                      <td className="py-3.5 px-4">{b.customer?.name}</td>
                      <td className="py-3.5 px-4">{b.date}</td>
                      <td className="py-3.5 px-4 font-bold">₹{b.totalAmount}</td>
                      <td className="py-3.5 px-4 text-slate-500">-₹{b.commissionAmount}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                        +₹{b.workerEarning}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Direct Settled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-xs text-slate-500">
            No completed bookings yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
