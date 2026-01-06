import React from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
// FIX: SelectOption is now defined in types.ts
import type { SelectOption } from '../../types';

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[] | readonly (string | SelectOption)[];
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-start)] focus:border-[var(--accent-start)] appearance-none"
        >
          {options.map((option) => {
            const val = typeof option === 'string' ? option : option.value;
            const lab = typeof option === 'string' ? option : option.label;
            return (
              <option key={val} value={val} className="bg-gray-800">
                {lab}
              </option>
            )
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};