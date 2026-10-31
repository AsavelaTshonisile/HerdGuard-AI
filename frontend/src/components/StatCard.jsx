import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'forest', className = '' }) {
  const colorMap = {
    forest: 'bg-forest-50 text-forest-800 border-forest-100',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    amber: 'bg-amber-50 text-amber-800 border-amber-100',
    rose: 'bg-rose-50 text-rose-800 border-rose-100',
    blue: 'bg-sky-50 text-sky-800 border-sky-100',
    purple: 'bg-purple-50 text-purple-800 border-purple-100',
  };

  const iconBgMap = {
    forest: 'bg-forest-700 text-white',
    green: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
    rose: 'bg-rose-600 text-white',
    blue: 'bg-sky-600 text-white',
    purple: 'bg-purple-600 text-white',
  };

  const currentTheme = colorMap[color] || colorMap.forest;
  const iconTheme = iconBgMap[color] || iconBgMap.forest;

  return (
    <div className={`p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-charcoal-muted">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-charcoal mt-1.5">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-charcoal-muted mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${iconTheme}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
