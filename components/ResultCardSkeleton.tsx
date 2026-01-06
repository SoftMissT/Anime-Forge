import React from 'react';

export const ResultCardSkeleton: React.FC = () => {
  return (
    <div className="result-card pointer-events-none opacity-50">
      <div className="h-[200px] w-full skeleton"></div>
      <div className="result-card-body">
        <div className="h-5 w-3/4 skeleton rounded-md mb-2"></div>
        <div className="flex gap-2 items-center mb-4">
            <div className="h-5 w-16 skeleton rounded-md"></div>
            <div className="h-4 w-12 skeleton rounded-md"></div>
        </div>
        <div className="h-4 w-full skeleton rounded-md mb-1.5"></div>
        <div className="h-4 w-2/3 skeleton rounded-md"></div>
        <div className="result-card-actions mt-auto">
            <div className="w-8 h-8 rounded-md skeleton"></div>
            <div className="w-8 h-8 rounded-md skeleton"></div>
        </div>
      </div>
    </div>
  );
};