import React from 'react';

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14.25l.225.225.225-.225a2.25 2.25 0 013.182 0l.225.225.225-.225a2.25 2.25 0 013.182 0l.225.225.225-.225a2.25 2.25 0 013.182 0l.225.225.225-.225M9.5 14.25L3 21m6.5-6.75v6.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75h-.008v.008H12v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
  </svg>
);
