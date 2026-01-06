// FIX: Added Spinner import
import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  // FIX: Added 'icon' size
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  // FIX: Added isLoading prop
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  // FIX: Destructure isLoading prop
  isLoading,
  ...props
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variantClasses = {
    primary: 'btn-forge',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent text-text-secondary hover:bg-white/10 focus:ring-[var(--accent-forge-start)]',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    // FIX: Added styles for icon size
    icon: 'p-2'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      // FIX: Disable button when loading
      disabled={props.disabled || isLoading}
      {...props}
    >
      {/* FIX: Show spinner when loading */}
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  );
};