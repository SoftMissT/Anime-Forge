import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  tooltip?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, tooltip, ...props }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-400">{label}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <span className="bg-gray-700 text-gray-200 text-xs font-semibold px-2 py-0.5 rounded">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-slider"
        {...props}
      />
    </div>
  );
};