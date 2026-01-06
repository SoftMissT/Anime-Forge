import React from 'react';

export const MidjourneyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
    >
        <path d="M12 2L3 22h18L12 2z" />
        <path d="M12 12l8 10" />
        <path d="M12 12L4 22" />
    </svg>
);
