import React from 'react';

export const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
    >
        <path d="M10.5,2.25a1.5,1.5,0,0,0-3,0V7.5a1.5,1.5,0,0,0,3,0V2.25Zm3,6a1.5,1.5,0,0,0,3,0V4.5a1.5,1.5,0,0,0-3,0v3.75Z" />
        <path d="M12,10.125a1.5,1.5,0,0,1,1.5-1.5h3.75a1.5,1.5,0,0,1,0,3H13.5A1.5,1.5,0,0,1,12,10.125Zm-7.5,5.625a1.5,1.5,0,0,0,0,3h9a1.5,1.5,0,0,0,0-3h-9Z" />
    </svg>
);
