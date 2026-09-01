import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import BookingModal from '../components/BookingModal';
import StarRating from '../components/StarRating';
import {
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  Paintbrush,
  Tv,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Percent,
  ArrowLeft,
  Calendar,
  UserCheck,
} from 'lucide-react';

const iconMap = {
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  Paintbrush,
  Tv,
};

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/services/${id}`);
        if (res.data.success) {
          setService(res.data.service);
          setWorkers(res.data.workers || []);
        }
      } catch (err) {
        setError('Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleBookWorker = (worker) => {
    setSelectedWorker(worker);
    setBookingModalOpen(true);
  };

  const handleGeneralBook = () => {
    setSelectedWorker(null);
    setBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Loading service details & available artisans...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Service Not Found</h2>
        <Link
          to="/services"
          className="inline-flex items-center space-x-2 text-sm text-emerald-600 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services Catalog</span>
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Wrench;
  const workerCut = Math.round(service.basePrice * 0.9);
  const coopCut = service.basePrice - workerCut;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link
        to="/services"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Services</span>
      </Link>

      {/* Main Service Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-premium">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {service.category} Service
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {service.name}
                </h1>
              </div>
            </div>

            <p className="text-slate-600 text-base leading-relaxed">
              {service.description}
            </p>

            {/* Service Highlights */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Service Inclusions & Quality Guarantees
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-500 pt-2">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Estimated Duration: {service.duration || '1-2 hours'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cooperative Quality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Pricing & Booking Action Box */}
          <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Standard Cooperative Rate
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  ₹{service.basePrice}
                </span>
                <span className="text-xs text-slate-400">/ service visit</span>
              </div>
            </div>

            {/* Fair Wage Split Breakdown */}
            <div className="bg-slate-800/80 rounded-2xl p-4 space-y-2 border border-slate-700/60 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center space-x-1">
                  <span>Worker Share (90%)</span>
                </span>
                <span className="font-bold text-emerald-400">₹{workerCut}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Cooperative Administration (10%)</span>
                <span>₹{coopCut}</span>
              </div>
            </div>

            <button
              onClick={handleGeneralBook}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Verified Workers for this Service */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Verified {service.category} Artisans Available
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Choose your preferred tradesperson or book directly with the next available artisan.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            {workers.length} Available
          </span>
        </div>

        {workers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div
                key={worker._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                        {worker.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {worker.name}
                        </h3>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <StarRating rating={worker.avgRating} size={13} showNumber={true} />
                          <span>({worker.totalReviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                    {worker.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {worker.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Experience</span>
                    <span className="text-xs font-bold text-slate-800">{worker.experience} Years</span>
                  </div>
                  <button
                    onClick={() => handleBookWorker(worker)}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Book Worker</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Cooperative artisans will be automatically assigned to your requested time slot upon booking.
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        service={service}
        selectedWorker={selectedWorker}
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedWorker(null);
        }}
      />
    </div>
  );
};

export default ServiceDetail;
