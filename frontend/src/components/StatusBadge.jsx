import React from 'react';

const statusStyles = {
  // Animal health statuses
  healthy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  monitoring: 'bg-amber-100 text-amber-800 border-amber-200',
  sick: 'bg-rose-100 text-rose-800 border-rose-200',
  quarantined: 'bg-purple-100 text-purple-800 border-purple-200',

  // Risk categories
  'Low Risk': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Moderate Risk': 'bg-amber-100 text-amber-800 border-amber-300',
  'High Risk': 'bg-orange-100 text-orange-800 border-orange-300',
  'Urgent Attention Required': 'bg-red-100 text-red-800 border-red-300 font-semibold animate-pulse',

  // Report workflow statuses
  'Submitted': 'bg-blue-100 text-blue-800 border-blue-200',
  'Under Review': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Professional Review Required': 'bg-amber-100 text-amber-800 border-amber-200',
  'Action Recommended': 'bg-orange-100 text-orange-800 border-orange-200',
  'Resolved': 'bg-teal-100 text-teal-800 border-teal-200',
  'Closed': 'bg-gray-100 text-gray-700 border-gray-200',

  // Incident verification statuses
  'Suspected': 'bg-amber-100 text-amber-800 border-amber-300',
  'Professionally Reviewed': 'bg-blue-100 text-blue-800 border-blue-300',
  'Official Outbreak': 'bg-red-100 text-red-800 border-red-300 font-semibold',

  // General statuses
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  contained: 'bg-blue-100 text-blue-800 border-blue-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  scheduled: 'bg-sky-100 text-sky-800 border-sky-200',
};

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  if (!status) return null;
  const style = statusStyles[status] || statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm font-medium' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${sizeClass} ${style} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
}
