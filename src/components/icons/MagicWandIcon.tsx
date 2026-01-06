import React from 'react';

export const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="100%"
        height="100%"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25278V3.75M12 20.25V17.7472M6.25278 12H3.75M20.25 12H17.7472M16.9497 7.05025L18.7175 5.28247M5.28247 18.7175L7.05025 16.9497M16.9497 16.9497L18.7175 18.7175M5.28247 5.28247L7.05025 7.05025" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14L5 19" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 5L14 10" />
    </svg>
);
