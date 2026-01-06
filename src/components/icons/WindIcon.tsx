import React from 'react';

export const WindIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M17.7 7.7a2.5 2.5 0 11-3.54 0" />
    <path d="M6.3 16.3a2.5 2.5 0 103.54 0" />
    <path d="M12 12a2.5 2.5 0 100-5" />
    <path d="M12 17a2.5 2.5 0 11-5 0" />
    <path d="M19.3 19.3a2.5 2.5 0 100-3.54" />
    <path d="M4.7 4.7a2.5 2.5 0 113.54 0" />
  </svg>
);
