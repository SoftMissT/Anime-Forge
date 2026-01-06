import React from 'react';

export const KatanaIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M5 19l4-4" />
    <path d="M12.94 14.94L19.41 8.47" />
    <path d="M10.11 11.11L12.94 8.28" />
    <path d="M3 21l4-4" />
    <path d="M15.06 17.06L17.18 15.94" />
    <path d="m21.5 2.5-9.47 9.47" />
  </svg>
);
