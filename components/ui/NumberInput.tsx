import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min = 1, max = 10, step = 1 }) => {
  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  return (
    <div>
      <span className="text-sm font-medium text-gray-400 mb-1 block">{label}</span>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleDecrement} 
          disabled={value <= min}
          className="number-input-button"
          aria-label="Decrement"
        >
          -
        </button>
        <input 
          type="text"
          readOnly 
          value={value}
          className="w-full text-center bg-gray-900/50 border border-gray-700 rounded-md py-2 px-1 text-white focus:outline-none"
          aria-label="Current quantity"
        />
        <button 
          onClick={handleIncrement} 
          disabled={value >= max}
          className="number-input-button"
          aria-label="Increment"
        >
          +
        </button>
      </div>
    </div>
  );
};
