import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  UserCheck,
  Percent,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import StarRating from './StarRating';

const timeSlots = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

const BookingModal = ({ service, selectedWorker = null, isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [workerId, setWorkerId] = useState(selectedWorker?._id || '');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState(user?.location || 'Indore');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('452001');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Set minimum date to tomorrow
  const minDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen && service) {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);

      if (selectedWorker) {
        setWorkerId(selectedWorker._id);
      } else {
        // Fetch workers matching this service category
        const fetchWorkers = async () => {
          setLoadingWorkers(true);
          try {
            const res = await api.get(`/auth/workers?category=${service.category}`);
            if (res.data.success && res.data.workers.length > 0) {
              setWorkers(res.data.workers);
              setWorkerId(res.data.workers[0]._id);
            }
          } catch (err) {
            console.error('Failed fetching workers for modal:', err);
          } finally {
            setLoadingWorkers(false);
          }
        };
        fetchWorkers();
      }
    }
  }, [isOpen, service, selectedWorker]);

  if (!isOpen || !service) return null;

  const totalAmount = service.basePrice || 400;
  const commissionRate = 10;
  const commissionAmount = Math.round((totalAmount * commissionRate) / 100);
  const workerEarning = totalAmount - commissionAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!workerId) {
      setError('Please select a verified cooperative worker.');
      return;
    }

    if (!date || !timeSlot || !street) {
      setError('Please provide date, time slot, and full street address.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        serviceId: service._id,
        workerId,
        date,
        timeSlot,
        address: {
          street,
          city,
          landmark,
          pincode,
        },
        notes,
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          navigate('/bookings');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentWorker =
    selectedWorker || workers.find((w) => w._id === workerId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-200">
              Cooperative Booking
            </span>
            <h3 className="text-xl font-bold">{service.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-600/60 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">
                Booking Request Confirmed!
              </h4>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Your service appointment has been queued. The cooperative worker will confirm promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Worker Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Certified Worker
                </label>
                {selectedWorker ? (
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                        {selectedWorker.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {selectedWorker.name}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <StarRating rating={selectedWorker.avgRating || 5} size={12} />
                          <span>({selectedWorker.totalReviews || 0} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs bg-white text-emerald-700 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                      Pre-selected
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {loadingWorkers ? (
                      <div className="text-xs text-slate-500 py-2">Loading available workers...</div>
                    ) : workers.length > 0 ? (
                      <select
                        value={workerId}
                        onChange={(e) => setWorkerId(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {workers.map((w) => (
                          <option key={w._id} value={w._id}>
                            {w.name} ({w.experience} yrs exp • ★ {w.avgRating}) — ₹{w.hourlyRate}/hr
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                        No specific workers found for this category. An available cooperative artisan will be automatically dispatched.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Appointment Date</span>
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Time Window</span>
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Address */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Service Address</span>
                </label>
                <input
                  type="text"
                  placeholder="House / Flat No, Building, Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Job Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Problem Description / Notes (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tap leaking under the sink, need valve checked"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Cooperative Wage Transparency Ledger */}
              <div className="bg-slate-900 text-white rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                    <Percent className="w-3.5 h-3.5" />
                    <span>Transparent Cooperative Ledger</span>
                  </span>
                  <span>Direct Cash/UPI</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Service Amount:</span>
                    <span className="font-semibold text-white">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cooperative Admin Support ({commissionRate}%):</span>
                    <span>- ₹{commissionAmount}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800 text-sm">
                    <span>Worker Net Take-Home (90%):</span>
                    <span>₹{workerEarning}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-700/20 text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <span>Confirm Booking (Pay ₹{totalAmount} on Completion)</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
