import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Syringe, 
  ShieldAlert, 
  FileText,
  Check
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const filtered = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === filter);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'disease_alert':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'vaccination':
        return <Syringe className="w-5 h-5 text-emerald-600" />;
      case 'health_report':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-forest-700" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Notifications & Alerts</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Stay updated on health report reviews, vaccine reminders, and municipal disease notices
          </p>
        </div>

        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-cream border border-gray-200 text-charcoal font-semibold text-xs rounded-xl transition shadow-sm"
          >
            <Check className="w-3.5 h-3.5 text-forest-700" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'disease_alert', label: 'Biosecurity Alerts' },
          { id: 'vaccination', label: 'Vaccinations' },
          { id: 'health_report', label: 'Health Reports' },
          { id: 'system', label: 'System' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition ${
              filter === tab.id
                ? 'bg-forest-800 text-white font-bold shadow-sm'
                : 'bg-white hover:bg-gray-100 text-charcoal border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications in this category"
          description="You will receive alerts when reports are reviewed or vaccinations are due."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between space-x-4 ${
                !n.is_read 
                  ? 'bg-white border-forest-300 shadow-sm ring-1 ring-forest-100' 
                  : 'bg-white/80 border-gray-100'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-cream flex-shrink-0 mt-0.5">
                  {getCategoryIcon(n.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-charcoal">{n.title}</h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-forest-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-400 block pt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="px-2.5 py-1 rounded-lg bg-forest-50 hover:bg-forest-100 text-forest-800 text-[11px] font-semibold flex-shrink-0 transition"
                  title="Mark as read"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
