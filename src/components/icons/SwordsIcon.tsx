import React from 'react';

export const SwordsIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="m14.5 17.5-11-11" />
    <path d="m21 3-9.5 9.5" />
    <path d="m9.5 6.5-6.5 6.5" />
    <path d="m14.5 17.5 6.5-6.5" />
    <path d="m3 21 7.5-7.5" />
    <path d="m13.5 10.5 7.5 7.5" />
  </svg>
);
