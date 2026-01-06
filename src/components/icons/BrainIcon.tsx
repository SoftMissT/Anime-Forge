import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    width="100%"
    height="100%"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 13.5c0 1.657 1.343 3 3 3s3-1.343 3-3V9.5c0-1.657-1.343-3-3-3s-3 1.343-3 3V13.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V21m0-18v3m-3.364 1.636L7.5 7.5m9 9l-1.136-1.136M7.5 16.5l1.136-1.136M16.5 7.5l-1.136 1.136M21 12h-3m-6 0H3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13.5a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
