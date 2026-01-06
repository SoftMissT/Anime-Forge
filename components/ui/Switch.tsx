import React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Switch: React.FC<SwitchProps> = ({ label, checked, onChange, disabled, ...props }) => {
  const labelClasses = `flex items-center space-x-2 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`;

  return (
    <label className={labelClasses}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[var(--accent-start)]' : 'bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
      </div>
      <span className="text-sm text-gray-300 select-none">{label}</span>
    </label>
  );
};