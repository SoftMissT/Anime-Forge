import React from 'react';
import { Tooltip } from './ui/Tooltip';
import { InfoIcon } from './icons/InfoIcon';

interface AboutTooltipProps {
  onClick: () => void;
}

export const AboutTooltip: React.FC<AboutTooltipProps> = ({ onClick }) => {
  return (
    <Tooltip text="Sobre">
      <button 
        onClick={onClick}
        className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
        aria-label="Sobre"
      >
        <InfoIcon className="w-6 h-6" />
      </button>
    </Tooltip>
  );
};