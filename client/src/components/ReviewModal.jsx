import React, { useState } from 'react';
import { X, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import StarRating from './StarRating';

const ReviewModal = ({ booking, isOpen, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please share a few words about your service experience.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/reviews', {
        bookingId: booking._id,
        rating,
        comment,
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onReviewSubmitted) onReviewSubmitted(res.data.review);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-200">
              Feedback & Rating
            </span>
            <h3 className="text-lg font-bold">Review Service</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-600/60 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-xl font-bold text-slate-900">
                Review Submitted!
              </h4>
              <p className="text-xs text-slate-600">
                Thank you for rating {booking.worker?.name}. Your feedback empowers our cooperative workers.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Service & Worker Context */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {booking.worker?.name?.charAt(0) || 'W'}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {booking.worker?.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {booking.service?.name}
                  </div>
                </div>
              </div>

              {/* Star Rating Interactive Input */}
              <div className="text-center py-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tap to Rate Your Experience
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={rating}
                    interactive={true}
                    onChange={(val) => setRating(val)}
                    size={32}
                  />
                </div>
                <div className="text-xs font-semibold text-emerald-700 mt-2">
                  {rating === 5 && '🌟 Exceptional Service!'}
                  {rating === 4 && '👍 Great & Professional'}
                  {rating === 3 && '👌 Satisfactory'}
                  {rating === 2 && '👎 Needs Improvement'}
                  {rating === 1 && '⚠️ Poor Experience'}
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Comments & Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about punctuality, workmanship, cleanliness, and professionalism..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-700/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting Review...' : 'Submit Cooperative Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
