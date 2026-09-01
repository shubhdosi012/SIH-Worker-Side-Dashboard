import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Percent, Users, Award, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cooperative Mission Banner */}
        <div className="bg-gradient-to-r from-emerald-900/60 to-slate-800/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">
                The 90/10 Cooperative Wage Charter
              </h4>
              <p className="text-slate-300 text-sm max-w-xl">
                Unlike corporate gig platforms that take 25–40% cuts, SevaSangam caps administrative fees at 10%. Workers retain 90% of every rupee earned.
              </p>
            </div>
          </div>
          <Link
            to="/register?role=worker"
            className="whitespace-nowrap px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md hover:scale-105"
          >
            Become a Worker Partner
          </Link>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Seva<span className="text-emerald-400">Sangam</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's democratic home service cooperative. Connecting honest homeowners with skilled local tradespeople under ethical, transparent, and fair-wage standards.
            </p>
            <div className="flex items-center space-x-3 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Background Verified Workers</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Essential Trades
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services?category=plumbing" className="hover:text-emerald-400 transition-colors">
                  Plumbing & Pipe Repair
                </Link>
              </li>
              <li>
                <Link to="/services?category=electrical" className="hover:text-emerald-400 transition-colors">
                  Electrical & Switchboard
                </Link>
              </li>
              <li>
                <Link to="/services?category=cleaning" className="hover:text-emerald-400 transition-colors">
                  Deep Cleaning & Sanitizing
                </Link>
              </li>
              <li>
                <Link to="/services?category=carpentry" className="hover:text-emerald-400 transition-colors">
                  Carpentry & Lock Fitting
                </Link>
              </li>
              <li>
                <Link to="/services?category=painting" className="hover:text-emerald-400 transition-colors">
                  Painting & Wall Putty
                </Link>
              </li>
              <li>
                <Link to="/services?category=appliance-repair" className="hover:text-emerald-400 transition-colors">
                  Appliance & Fridge Repair
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Cooperative Model */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Cooperative Model
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2 text-slate-400">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Worker-Led Governance</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>Transparent 10% Fee</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Direct UPI / Cash Settlement</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cooperative Quality Shield</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Portals */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Quick Portals
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Customer & Worker Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Create Customer Account
                </Link>
              </li>
              <li>
                <Link to="/register?role=worker" className="hover:text-emerald-400 transition-colors">
                  Register as Service Artisan
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1">
                  <span>Cooperative Audit Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SevaSangam Cooperative Services. Empowering skilled workers across communities.</p>
          <div className="flex items-center space-x-6">
            <span className="text-emerald-400 font-medium">Zero Predatory Commissions</span>
            <span>•</span>
            <span>Democratic Wage Rights</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
