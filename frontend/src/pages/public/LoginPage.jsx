import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, Stethoscope, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'professional') {
          navigate('/professional');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Login failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-forest-300" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-charcoal">
            Sign In to HerdGuard AI
          </h2>
          <p className="mt-1 text-xs text-charcoal-muted">
            South African Livestock Health & Biosecurity Intelligence
          </p>
        </div>

        {/* Quick-fill Demonstration Credentials */}
        <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-100 text-xs">
          <span className="font-bold text-forest-900 block mb-2 text-center uppercase tracking-wider text-[11px]">
            ⚡ Quick-Fill Demonstration Accounts
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('farmer@herdguard.co.za')}
              className="py-1.5 px-2 bg-white hover:bg-forest-100/70 border border-forest-200 text-forest-800 rounded-lg text-center font-medium transition flex flex-col items-center"
            >
              <UserCheck className="w-4 h-4 mb-0.5 text-forest-600" />
              <span>Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('vet@herdguard.co.za')}
              className="py-1.5 px-2 bg-white hover:bg-forest-100/70 border border-forest-200 text-forest-800 rounded-lg text-center font-medium transition flex flex-col items-center"
            >
              <Stethoscope className="w-4 h-4 mb-0.5 text-forest-600" />
              <span>Vet / Officer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin@herdguard.co.za')}
              className="py-1.5 px-2 bg-white hover:bg-forest-100/70 border border-forest-200 text-forest-800 rounded-lg text-center font-medium transition flex flex-col items-center"
            >
              <ShieldAlert className="w-4 h-4 mb-0.5 text-forest-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. farmer@herdguard.co.za"
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-charcoal-muted">
          Don't have a farm registered?{' '}
          <Link to="/register" className="font-bold text-forest-700 hover:underline">
            Register your farm here
          </Link>
        </div>
      </div>
    </div>
  );
}
