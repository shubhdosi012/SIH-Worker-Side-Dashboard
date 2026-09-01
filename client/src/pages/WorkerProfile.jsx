import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import BookingModal from '../components/BookingModal';
import {
  Wrench,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchWorkerData = async () => {
      setLoading(true);
      try {
        const [workerRes, reviewsRes, servicesRes] = await Promise.all([
          api.get(`/auth/workers/${id}`),
          api.get(`/reviews/worker/${id}`),
          api.get('/services'),
        ]);

        if (workerRes.data.success) {
          setWorker(workerRes.data.worker);
        }
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews || []);
        }
        if (servicesRes.data.success) {
          // Find services matching worker category
          const matching = servicesRes.data.services.filter(
            (s) => s.category === workerRes.data.worker.category
          );
          setServices(matching.length > 0 ? matching : servicesRes.data.services);
        }
      } catch (err) {
        setError('Failed to load artisan profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [id]);

  const handleBookService = (service) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Loading artisan profile & reviews...</p>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Worker Profile Not Found</h2>
        <Link
          to="/services"
          className="inline-flex items-center space-x-2 text-sm text-emerald-600 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/services"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </Link>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-premium space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-emerald-700/20">
              {worker.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {worker.name}
                </h1>
                <ShieldCheck className="w-5 h-5 text-emerald-600" title="Cooperative Verified" />
              </div>
              <p className="text-sm font-bold text-emerald-700 capitalize mt-0.5">
                {worker.category} Specialist • {worker.experience} Years Experience
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{worker.location || 'Indore'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                  <StarRating rating={worker.avgRating} size={13} showNumber={true} />
                  <span>({worker.totalReviews} reviews)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Cooperative Base Rate
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              ₹{worker.hourlyRate}
              <span className="text-xs text-slate-500 font-normal">/hr</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
              90% Directly to Worker
            </span>
          </div>
        </div>

        {/* Bio */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            About the Artisan
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            {worker.bio}
          </p>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Specialized Trade Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {worker.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-3 py-1.5 rounded-xl border border-emerald-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Matching Services for this Worker */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          Book a Service with {worker.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-xs hover:shadow-card-hover transition-all"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{service.name}</h3>
                <span className="text-xs text-slate-500 font-medium">
                  ₹{service.basePrice} • {service.duration || '1-2 hrs'}
                </span>
              </div>
              <button
                onClick={() => handleBookService(service)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>Verified Customer Reviews</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
              {reviews.length}
            </span>
          </h2>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {rev.customer?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {rev.customer?.name || 'Homeowner'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size={12} />
                </div>
                <p className="text-slate-600 text-xs leading-relaxed italic">
                  "{rev.comment}"
                </p>
                {rev.serviceName && (
                  <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    Service: {rev.serviceName}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No customer reviews recorded yet. Be the first to book and rate!
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          selectedWorker={worker}
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

export default WorkerProfile;
