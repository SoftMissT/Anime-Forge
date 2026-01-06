import React from 'react';

export const ForgeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="100%"
    height="100%"
  >
    <path d="M5 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0zM3 18v-6h18v6" />
    <path d="M11.5 12.5c0-2.5 1.5-4 4-5.5" />
    <path d="M2 12h20" />
    <path d="M4 4v2" />
    <path d="M10 4v2" />
    <path d="M16 4v2" />
  </svg>
);
