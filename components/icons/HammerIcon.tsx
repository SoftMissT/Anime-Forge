import React from 'react';

export const HammerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="100%"
    height="100%"
  >
    <path d="M15 12l-8.373 8.373a1 1 0 1 1-1.414-1.414L12.586 12l-2.829-2.828a1 1 0 0 1 0-1.414l4.243-4.243a1 1 0 0 1 1.414 0l2.828 2.828a1 1 0 0 1 0 1.414L15 12z" />
    <path d="M9 15l-4.243 4.243a1 1 0 0 0 1.414 1.414L10 17" />
  </svg>
);
