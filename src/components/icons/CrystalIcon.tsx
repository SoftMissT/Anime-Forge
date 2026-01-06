import React from 'react';

export const CrystalIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 2L4 8l8 6 8-6-8-6z" />
    <path d="M4 8v8l8 6 8-6V8" />
    <path d="M12 20V14" />
    <path d="M4 8l8 6" />
    <path d="M20 8l-8 6" />
  </svg>
);
