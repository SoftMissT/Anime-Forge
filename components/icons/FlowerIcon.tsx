import React from 'react';

export const FlowerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 12c0-4.55-3.7-8.25-8.25-8.25S3.75 7.45 3.75 12s3.7 8.25 8.25 8.25 8.25-3.7 8.25-8.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.03 7.47a6 6 0 00-8.06 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.53 15.97a6 6 0 01-9.06 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.47 7.97a6 6 0 010 8.06" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.03 16.53a6 6 0 000-9.06" />
    </svg>
);
