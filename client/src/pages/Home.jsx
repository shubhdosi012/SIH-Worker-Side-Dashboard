import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import StarRating from '../components/StarRating';
import {
  ShieldCheck,
  HeartHandshake,
  Percent,
  Award,
  ArrowRight,
  Search,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  Quote,
  MessageSquareHeart,
} from 'lucide-react';

const Home = () => {
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, workersRes, reviewsRes] = await Promise.all([
          api.get('/services?popular=true'),
          api.get('/auth/workers'),
          api.get('/reviews/recent?limit=6'),
        ]);

        if (servicesRes.data.success) {
          setServices(servicesRes.data.services);
        }
        if (workersRes.data.success) {
          setWorkers(workersRes.data.workers.slice(0, 4));
        }
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookNow = (service) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Headline & Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 text-xs font-bold tracking-wide">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                <span>India's 1st Worker-Owned Gig Services Cooperative</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Fair Wages for Artisans.{' '}
                <span className="text-gradient-emerald">
                  Honest Services for Homes.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Book verified plumbers, electricians, cleaners, and carpenters.
                Our cooperative model guarantees that{' '}
                <strong className="text-emerald-700 font-bold">
                  90% of your payment goes directly to the worker
                </strong>{' '}
                with zero predatory platform cuts.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-premium border border-slate-200 flex items-center max-w-xl"
              >
                <div className="pl-3 pr-2 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Try 'plumbing leak', 'switchboard repair', 'cleaning'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 py-2"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors shrink-0 flex items-center space-x-1"
                >
                  <span>Find Service</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </button>
              </form>

              {/* Mini Features row */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fixed Transparent Rates</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Background Verified</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Percent className="w-4 h-4 text-emerald-600" />
                  <span>10% Low Co-op Fee</span>
                </div>
              </div>
            </div>

            {/* Right Col: Cooperative Impact Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Percent className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">
                      Cooperative Transparency
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Formula
                  </span>
                </div>

                {/* Wage comparison visualization */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">
                        Typical Corporate App (25–35% Cut)
                      </span>
                      <span className="text-rose-400 font-bold">₹650 Worker Cut</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden flex">
                      <div
                        className="bg-rose-500 h-full rounded-l-full"
                        style={{ width: '65%' }}
                      ></div>
                      <div
                        className="bg-slate-700 h-full flex items-center justify-center text-[9px] font-bold text-slate-300"
                        style={{ width: '35%' }}
                      >
                        Platform 35%
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-emerald-300 font-bold flex items-center space-x-1">
                        <span>✨ SevaSangam Cooperative Model</span>
                      </span>
                      <span className="text-emerald-400 font-extrabold">₹900 Worker Cut</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden flex border border-emerald-500/40">
                      <div
                        className="bg-emerald-500 h-full rounded-l-full flex items-center px-2 text-[10px] font-extrabold text-slate-950"
                        style={{ width: '90%' }}
                      >
                        Worker Retains 90%
                      </div>
                      <div
                        className="bg-emerald-900 h-full flex items-center justify-center text-[9px] font-bold text-emerald-200"
                        style={{ width: '10%' }}
                      >
                        10%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric Badges */}
                <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-800/80">
                  <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
                    <span className="text-2xl font-extrabold text-white block">
                      100%
                    </span>
                    <span className="text-xs text-slate-400">
                      Direct Worker Payouts
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
                    <span className="text-2xl font-extrabold text-emerald-400 block">
                      ₹0
                    </span>
                    <span className="text-xs text-slate-400">
                      Hidden Surcharges
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Services Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
              Essential Home Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Cooperative Services
            </h2>
          </div>
          <Link
            to="/services"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>Explore All 8+ Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 bg-slate-100 animate-pulse rounded-2xl"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Cooperative Values & Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
              Why A Cooperative Model?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              Transforming Gig Economy From Exploitation To Dignity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-emerald-800/60 border border-emerald-700/50 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">90% Payout Standard</h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Every service ticket is processed through a fixed 10% administrative cap. Workers take home 90% immediately upon job completion.
              </p>
            </div>

            <div className="bg-emerald-800/60 border border-emerald-700/50 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Verified Local Artisans</h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                No random subcontracting. Every electrician, plumber, and cleaner undergoes trade skill vetting and government ID verification.
              </p>
            </div>

            <div className="bg-emerald-800/60 border border-emerald-700/50 p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Community Trust</h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                When workers are treated fairly, they take immense pride in their craftsmanship. Enjoy respectful service and long-term relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Feedback / Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
            Real Stories, Real Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            What Our Customers Say
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Genuine feedback from households across India who chose the cooperative way.
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div
                key={review._id}
                className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Decorative quote icon */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Quote className="w-4 h-4 text-emerald-500" />
                </div>

                <div>
                  {/* Star rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <StarRating rating={review.rating} size={15} showNumber={false} />
                    <span className="text-xs font-bold text-amber-600 ml-1">
                      {review.rating}.0
                    </span>
                  </div>

                  {/* Review comment */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-4">
                    "{review.comment}"
                  </p>

                  {/* Service tag */}
                  {review.serviceName && (
                    <span className="inline-flex items-center text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200/60 mb-4">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {review.serviceName}
                    </span>
                  )}
                </div>

                {/* Customer info */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {review.customer?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {review.customer?.name || 'Customer'}
                      </h4>
                      {review.customer?.location && (
                        <span className="text-[10px] text-slate-400 flex items-center space-x-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{review.customer.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {review.worker && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Served by</span>
                      <span className="text-xs font-semibold text-emerald-700 capitalize">
                        {review.worker.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <MessageSquareHeart className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              Customer reviews will appear here after completed bookings.
            </p>
          </div>
        )}
      </section>

      {/* 5. Featured Skilled Workers Champions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
            Verified Professionals
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Meet Our Top Cooperative Artisans
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Experienced specialists rated 4.8+ by satisfied neighborhood households.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workers.map((worker) => (
            <div
              key={worker._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white font-bold text-base flex items-center justify-center shadow-xs">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {worker.name}
                    </h3>
                    <span className="text-xs text-emerald-700 font-semibold capitalize block">
                      {worker.category} Specialist
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs mb-3">
                  <StarRating rating={worker.avgRating} size={13} showNumber={true} />
                  <span className="text-slate-400">({worker.totalReviews} reviews)</span>
                </div>

                <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                  {worker.bio}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {worker.skills?.slice(0, 2).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Rate</span>
                  <div className="font-bold text-slate-900 text-sm">
                    ₹{worker.hourlyRate}<span className="text-xs text-slate-500 font-normal">/hr</span>
                  </div>
                </div>
                <Link
                  to={`/workers/${worker._id}`}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          service={selectedService}
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

export default Home;
