import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import { Search, Filter, Wrench, Zap, Sparkles, Hammer, Paintbrush, Tv, HeartHandshake } from 'lucide-react';

const categoryTabs = [
  { id: 'all', name: 'All Trades', icon: HeartHandshake },
  { id: 'plumbing', name: 'Plumbing', icon: Wrench },
  { id: 'electrical', name: 'Electrical', icon: Zap },
  { id: 'cleaning', name: 'Deep Cleaning', icon: Sparkles },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer },
  { id: 'painting', name: 'Painting', icon: Paintbrush },
  { id: 'appliance-repair', name: 'Appliance Repair', icon: Tv },
];

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let url = '/services';
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== 'all') {
          params.append('category', activeCategory);
        }
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        const res = await api.get(url);
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleBookNow = (service) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Verified Service Catalog
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Household Services Directory
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Transparent fixed base rates with 90% paid directly to the artisan.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search service title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryTabs.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs scale-102'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onBookNow={handleBookNow}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No matching services found
          </h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('all');
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

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

export default Services;
