import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-forest-700 ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-forest-600`} />
      {message && <p className="mt-3 text-sm text-charcoal-muted font-medium">{message}</p>}
    </div>
  );
}
