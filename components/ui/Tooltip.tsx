import React, { useState, useRef } from 'react';

// FIX: Implemented the Tooltip component to resolve multiple module-not-found and syntax errors.
// This component provides a hover-activated tooltip with a slight delay for better UX.
interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'bottom', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  // FIX: Replaced `NodeJS.Timeout` with `ReturnType<typeof setTimeout>` to use the correct browser-compatible type for the `setTimeout` return value, resolving the "Cannot find namespace 'NodeJS'" error.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && text && (
        <div 
          role="tooltip"
          className={`absolute z-50 px-2 py-1 text-xs font-semibold text-white bg-gray-900 border border-gray-700 rounded-md shadow-lg whitespace-nowrap animate-fade-in-fast ${positionClasses[position]}`}
        >
          {text}
        </div>
      )}
    </div>
  );
};