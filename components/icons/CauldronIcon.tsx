

import React from 'react';

export const CauldronIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M2 12c0-2.8 2.2-5 5-5h10c2.8 0 5 2.2 5 5v5c0 2.8-2.2 5-5 5H7c-2.8 0-5-2.2-5-5v-5z" />
    <path d="M7 7c0-2.8-2.2-5-5-5" />
    <path d="M17 7c0-2.8 2.2-5 5-5" />
    <path d="M6 22v-2" />
    <path d="M18 22v-2" />
  </svg>
);
