import React from 'react';

export const OniIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="100%"
    height="100%"
  >
    <path d="M10 17a2 2 0 10-4 0" />
    <path d="M18 17a2 2 0 10-4 0" />
    <path d="M5.5 12.5c-1.5-1-1.5-4 0-5" />
    <path d="M18.5 12.5c1.5-1 1.5-4 0-5" />
    <path d="M12 2a10 10 0 00-10 10v10h20V12A10 10 0 0012 2z" />
    <path d="M6 12h12" />
    <path d="M14 2h-4" />
  </svg>
);
