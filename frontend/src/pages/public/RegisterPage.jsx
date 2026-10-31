import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, Phone, MapPin, Building, ArrowRight, Stethoscope } from 'lucide-react';

const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    province: 'Free State',
    organization_or_practice: '',
    role: 'farmer'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Registration failed. Please verify your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-forest-300" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-charcoal">
            Register Farm Account
          </h2>
          <p className="mt-1 text-xs text-charcoal-muted">
            Join South Africa’s digital livestock health & disease monitoring platform
          </p>
        </div>

        {/* Veterinary Notice Callout */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/70 text-xs text-blue-900 flex items-start space-x-2.5">
          <Stethoscope className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-blue-950 block">Are you a Veterinarian or Extension Officer?</span>
            Veterinary accounts cannot be self-registered. Credentials must be assigned directly by a HerdGuard system administrator. Please contact your platform administrator for provisioned access.
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Sipho Mthembu"
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="farmer@domain.co.za"
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+27 82 000 0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Province
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 transition appearance-none"
                >
                  {SA_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Farm / Enterprise Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.organization_or_practice}
                  onChange={(e) => setFormData({ ...formData, organization_or_practice: e.target.value })}
                  placeholder="e.g. Vredehoek Farming"
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Farmer Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-charcoal-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-forest-700 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
