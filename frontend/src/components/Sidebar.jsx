import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  PlusCircle,
  Syringe,
  Map,
  Bot,
  Bell,
  User,
  Users,
  ShieldCheck,
  BookOpen,
  FileCheck2,
  AlertTriangle,
  Layers
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const role = user?.role || 'farmer';

  // Base navigation items based on user role
  const farmerNav = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'My Farms', to: '/farms', icon: MapPin },
    { name: 'Livestock Records', to: '/animals', icon: Layers },
    { name: 'Health Reports', to: '/health-reports', icon: ClipboardList },
    { name: 'Submit Health Report', to: '/health-reports/new', icon: PlusCircle, highlight: true },
    { name: 'Vaccination Schedule', to: '/vaccinations', icon: Syringe },
    { name: 'Disease Risk Map', to: '/disease-map', icon: Map },
    { name: 'HerdGuard AI Assistant', to: '/assistant', icon: Bot },
    { name: 'Knowledge Resources', to: '/knowledge', icon: BookOpen },
    { name: 'Notifications', to: '/notifications', icon: Bell },
    { name: 'Profile & Settings', to: '/profile', icon: User },
  ];

  const professionalNav = [
    { name: 'Vet Dashboard', to: '/professional', icon: LayoutDashboard },
    { name: 'Assigned Reports', to: '/health-reports', icon: FileCheck2 },
    { name: 'Disease Risk Map', to: '/disease-map', icon: Map },
    { name: 'Livestock Directory', to: '/animals', icon: Layers },
    { name: 'Vaccinations', to: '/vaccinations', icon: Syringe },
    { name: 'HerdGuard AI Assistant', to: '/assistant', icon: Bot },
    { name: 'Knowledge Resources', to: '/knowledge', icon: BookOpen },
    { name: 'Notifications', to: '/notifications', icon: Bell },
    { name: 'Profile', to: '/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Admin Dashboard', to: '/admin', icon: LayoutDashboard },
    { name: 'User Management', to: '/admin/users', icon: Users },
    { name: 'Disease Incidents', to: '/admin/incidents', icon: AlertTriangle },
    { name: 'Knowledge Base', to: '/admin/knowledge', icon: BookOpen },
    { name: 'All Farms', to: '/farms', icon: MapPin },
    { name: 'All Livestock', to: '/animals', icon: Layers },
    { name: 'All Health Reports', to: '/health-reports', icon: ClipboardList },
    { name: 'Disease Risk Map', to: '/disease-map', icon: Map },
    { name: 'AI Assistant', to: '/assistant', icon: Bot },
    { name: 'Activity Logs', to: '/admin/activity-logs', icon: ShieldCheck },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'professional' ? professionalNav : farmerNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-charcoal-dark/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-muted/70">
            {role === 'admin' ? 'Administration' : role === 'professional' ? 'Veterinary Portal' : 'Farm Management'}
          </div>

          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-forest-800 text-white shadow-sm'
                      : item.highlight
                      ? 'bg-forest-50 text-forest-800 hover:bg-forest-100 font-semibold'
                      : 'text-charcoal hover:bg-cream-surface'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Small South Africa banner at bottom */}
        <div className="p-4 border-t border-gray-100 bg-cream-surface/60">
          <div className="flex items-center space-x-2 text-xs text-forest-900 font-semibold">
            <span className="w-2 h-2 rounded-full bg-forest-600"></span>
            <span>DALRRD Complementary</span>
          </div>
          <p className="text-[11px] text-charcoal-muted mt-1 leading-tight">
            Supporting South African livestock health & food security.
          </p>
        </div>
      </aside>
    </>
  );
}
