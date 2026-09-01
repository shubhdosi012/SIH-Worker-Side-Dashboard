import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ReviewModal from '../components/ReviewModal';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  ShieldCheck,
  Percent,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

const statusBadgeStyles = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  accepted: 'bg-blue-50 text-blue-800 border-blue-200',
  'in-progress': 'bg-purple-50 text-purple-800 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-200',
  rejected: 'bg-rose-50 text-rose-800 border-rose-200',
};

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setActionLoadingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: 'cancelled',
        cancelReason: 'Customer requested cancellation',
      });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    fetchBookings();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Service Bookings
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track appointments, communicate with artisans, and review completed work.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const badgeStyle =
              statusBadgeStyles[booking.status] || 'bg-slate-100 text-slate-700';

            return (
              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-card-hover transition-all space-y-4"
              >
                {/* Top Row: Service info and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-lg border border-emerald-100">
                      {booking.service?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">
                        {booking.service?.name || 'Home Service'}
                      </h3>
                      <span className="text-xs text-slate-500 capitalize">
                        Category: {booking.service?.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${badgeStyle}`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">
                      ₹{booking.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Worker Information */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                      Assigned Artisan
                    </span>
                    <div className="font-bold text-slate-800 text-sm">
                      {booking.worker?.name || 'Cooperative Dispatch'}
                    </div>
                    <div className="text-slate-500">
                      {booking.worker?.phone || 'Contact available upon dispatch'}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                      Schedule Window
                    </span>
                    <div className="font-bold text-slate-800 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{booking.timeSlot}</span>
                    </div>
                  </div>

                  {/* Address & Notes */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                      Location
                    </span>
                    <div className="text-slate-700 truncate">
                      {booking.address?.street}, {booking.address?.city}
                    </div>
                    {booking.notes && (
                      <div className="text-slate-500 truncate italic">
                        Note: "{booking.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Cooperative Financial Breakdown Banner */}
                <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-900 gap-2">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Fair Wage Ledger:</strong> Worker receives <strong>₹{booking.workerEarning}</strong> (90%) | Co-op admin fee: ₹{booking.commissionAmount} (10%)
                    </span>
                  </div>

                  <span className="font-semibold text-emerald-800">
                    Payment: {booking.paymentStatus === 'settled' ? '✅ Settled Directly' : '⏳ Cash/UPI on completion'}
                  </span>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end space-x-3 pt-1">
                  {/* Cancel action if pending/accepted */}
                  {['pending', 'accepted'].includes(booking.status) && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={actionLoadingId === booking._id}
                      className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {actionLoadingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}

                  {/* Review action if completed */}
                  {booking.status === 'completed' && (
                    <>
                      {booking.hasReview ? (
                        <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Reviewed & Rated ★</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenReview(booking)}
                          className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-xs transition-colors"
                        >
                          <Star className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Rate & Review Artisan</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            No service bookings yet
          </h3>
          <p className="text-xs text-slate-500">
            Support skilled cooperative workers by scheduling your first household maintenance appointment today.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>Browse Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedBookingForReview(null);
          }}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default BookingHistory;
