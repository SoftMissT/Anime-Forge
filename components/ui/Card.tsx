import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  
  const baseClasses = "relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-md p-0 transition-all duration-300 overflow-hidden";
  const clickableClasses = onClick ? "cursor-pointer hover:border-[var(--accent-forge-start)] hover:shadow-[0_0_15px_var(--glow-red)] hover:-translate-y-0.5" : "";
  
  return (
    <div className={`${baseClasses} ${clickableClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

// FIX: Added missing Card sub-components
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-4 border-b border-[var(--border-color)] ${className}`}>{children}</div>
);

// FIX: Updated CardTitle to accept additional HTML attributes to support `title` prop for tooltips.
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
    <h3 className={`text-base font-semibold text-text-primary ${className}`} {...props}>{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`p-4 border-t border-[var(--border-color)] flex items-center ${className}`}>{children}</div>
);