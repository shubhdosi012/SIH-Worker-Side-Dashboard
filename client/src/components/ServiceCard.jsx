import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  Paintbrush,
  Tv,
  Wind,
  Trees,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const iconMap = {
  Wrench: Wrench,
  Zap: Zap,
  Sparkles: Sparkles,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
  Tv: Tv,
  Wind: Wind,
  Trees: Trees,
};

const categoryBadgeColors = {
  plumbing: 'bg-blue-50 text-blue-700 border-blue-200',
  electrical: 'bg-amber-50 text-amber-800 border-amber-200',
  cleaning: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  carpentry: 'bg-orange-50 text-orange-800 border-orange-200',
  painting: 'bg-purple-50 text-purple-800 border-purple-200',
  'appliance-repair': 'bg-cyan-50 text-cyan-800 border-cyan-200',
  'ac-service': 'bg-teal-50 text-teal-800 border-teal-200',
  gardening: 'bg-lime-50 text-lime-800 border-lime-200',
};

const ServiceCard = ({ service, onBookNow }) => {
  const IconComponent = iconMap[service.icon] || Wrench;
  const badgeStyle = categoryBadgeColors[service.category] || 'bg-slate-100 text-slate-700';

  const workerCut = Math.round(service.basePrice * 0.9);
  const coopCut = service.basePrice - workerCut;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
            <IconComponent className="w-6 h-6" />
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${badgeStyle}`}
          >
            {service.category.replace('-', ' ')}
          </span>
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
          {service.name}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Feature Tags */}
        <div className="space-y-1.5 mb-4">
          {service.features?.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 mr-1" />
          <span>Approx {service.duration || '1-2 hours'}</span>
        </div>
      </div>

      {/* Card Footer: Transparent Price & CTAs */}
      <div className="bg-slate-50/80 border-t border-slate-100 p-5 space-y-3">
        {/* Fair Wage Breakdown Strip */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
              Cooperative Base Rate
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{service.basePrice}
              </span>
              <span className="text-xs text-slate-500">/ job</span>
            </div>
          </div>

          <div className="text-right bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
            <span className="text-[10px] text-emerald-800 font-bold block">
              Worker Payout (90%)
            </span>
            <span className="text-xs font-extrabold text-emerald-700">
              ₹{workerCut}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/services/${service._id}`}
            className="flex items-center justify-center text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <span>View Artisans</span>
          </Link>
          <button
            onClick={() => onBookNow && onBookNow(service)}
            className="flex items-center justify-center space-x-1 text-xs font-bold py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
