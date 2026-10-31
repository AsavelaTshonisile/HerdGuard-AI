import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../services/api';
import { 
  ShieldCheck, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = {
    farmer: 'Farmer',
    professional: 'Veterinary Professional',
    admin: 'System Administrator'
  }[user?.role] || 'User';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-charcoal hover:bg-cream-surface lg:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

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
        </div>

        {/* Right: Notifications & User profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream-surface transition relative focus:outline-none"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-charcoal">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-forest-700 hover:text-forest-900 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-charcoal-muted">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs hover:bg-cream-surface transition ${
                          !n.is_read ? 'bg-forest-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            n.category === 'disease_alert' ? 'text-red-600' : 'text-forest-600'
                          }`} />
                          <div className="flex-1">
                            <p className="font-semibold text-charcoal">{n.title}</p>
                            <p className="text-charcoal-muted mt-0.5 leading-snug">{n.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(n.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2 border-t border-gray-100 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-xs text-forest-700 font-semibold hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User profile details */}
          <div className="flex items-center space-x-3 border-l border-gray-100 pl-3 sm:pl-4">
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold text-charcoal leading-tight">
                {user?.full_name}
              </div>
              <div className="text-[11px] font-medium text-forest-700">
                {roleLabel}
              </div>
            </div>

            <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-sm">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-charcoal-muted hover:text-rose-700 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
