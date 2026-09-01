import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  User,
  Wrench,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  Percent,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const categories = [
  { id: 'plumbing', name: 'Plumbing & Pipe Repair' },
  { id: 'electrical', name: 'Electrical & Wiring' },
  { id: 'cleaning', name: 'Deep Cleaning & House Sanitization' },
  { id: 'carpentry', name: 'Carpentry & Furniture Fitting' },
  { id: 'painting', name: 'House Painting & Wall Putty' },
  { id: 'appliance-repair', name: 'Home Appliance & Fridge Repair' },
  { id: 'ac-service', name: 'AC Maintenance & Gas Refill' },
  { id: 'gardening', name: 'Gardening & Lawn Maintenance' },
];

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'worker' ? 'worker' : 'customer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Indore');

  // Worker specific fields
  const [category, setCategory] = useState('plumbing');
  const [experience, setExperience] = useState('3');
  const [hourlyRate, setHourlyRate] = useState('400');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('role') === 'worker') {
      setRole('worker');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        name,
        email,
        password,
        phone,
        location,
        role,
      };

      if (role === 'worker') {
        payload.category = category;
        payload.experience = Number(experience);
        payload.hourlyRate = Number(hourlyRate);
        payload.skills = skills;
        payload.bio = bio || 'Skilled service tradesperson dedicated to quality.';
      }

      const res = await register(payload);
      if (role === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/services');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-mesh">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-slate-200/80">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/20">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Your SevaSangam Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Join India's fairest cooperative service community today.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                role === 'customer'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                role === 'worker'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Worker Partner</span>
            </button>
          </div>

          {role === 'worker' && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800">
              <Percent className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Cooperative 90% Wage Guarantee</span>
                <span>You retain 90% of every service ticket. No hidden commission deductions.</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Location / Neighborhood
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vijay Nagar, Indore"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Worker Specific Profile Setup */}
            {role === 'worker' && (
              <div className="pt-4 border-t border-slate-200/80 space-y-4">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  🛠️ Professional Trade Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Experience
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                      placeholder="Years"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Base Rate (₹/hr)
                    </label>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialized Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pipe fitting, Tank cleaning, Leak repair"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Short Bio
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe your professional craftsmanship and commitment to customer trust..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>
                    {role === 'worker' ? 'Complete Artisan Registration' : 'Register Customer Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
