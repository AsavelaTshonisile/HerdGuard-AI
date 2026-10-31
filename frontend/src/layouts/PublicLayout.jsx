import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

export default function PublicLayout() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardRoute = user?.role === 'admin' 
    ? '/admin' 
    : user?.role === 'professional' 
      ? '/professional' 
      : '/dashboard';

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-800 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-forest-300" />
            </div>
            <div>
              <span className="font-bold text-lg text-forest-900 tracking-tight">HerdGuard</span>
              <span className="font-extrabold text-lg text-forest-500 ml-1">AI</span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-forest-100 text-forest-800 rounded">
                South Africa
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-charcoal">
            <Link to="/" className="hover:text-forest-700 transition">Home</Link>
            <Link to="/about" className="hover:text-forest-700 transition">About</Link>
            <Link to="/features" className="hover:text-forest-700 transition">Features</Link>
            <Link to="/contact" className="hover:text-forest-700 transition">Contact & Support</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to={dashboardRoute}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-sm font-medium transition shadow-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-forest-900 hover:bg-forest-50 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-sm font-medium transition shadow-sm"
                >
                  <span>Register Farm</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 border-b border-gray-100 bg-white space-y-2 text-sm font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-charcoal">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-charcoal">About</Link>
            <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-charcoal">Features</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-charcoal">Contact & Support</Link>
            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
              {isAuthenticated ? (
                <Link
                  to={dashboardRoute}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-forest-800 text-white rounded-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 bg-gray-50 text-charcoal rounded-xl"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 bg-forest-700 text-white rounded-xl"
                  >
                    Register Farm
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
