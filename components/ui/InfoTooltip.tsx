import React from 'react';
import { Tooltip } from './Tooltip';
import { HelpIcon } from '../icons/HelpIcon';

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, className = '' }) => {
  return (
    <Tooltip text={text} position="top">
      <div className={`text-gray-500 hover:text-gray-300 transition-colors ${className}`}>
        <HelpIcon className="w-4 h-4" />
      </div>
    </Tooltip>
  );
};
