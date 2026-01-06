import React from 'react';

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5a2.25 2.25 0 01-2.25 2.25H9.75A2.25 2.25 0 017.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
    </svg>
);
