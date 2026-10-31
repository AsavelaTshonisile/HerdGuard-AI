import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function EmptyState({
  icon: Icon = HelpCircle,
  title = 'No records found',
  description = 'Get started by creating your first record.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200 my-4 ${className}`}>
      <div className="w-14 h-14 bg-forest-50 text-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
      <p className="text-sm text-charcoal-muted mt-1 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-medium rounded-xl shadow-sm transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
