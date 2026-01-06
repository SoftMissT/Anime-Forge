import React from 'react';
import { DiscordIcon } from './icons/DiscordIcon';
import { Tooltip } from './ui/Tooltip';

interface DiscordLoginButtonProps {
  onClick: () => void;
}

export const DiscordLoginButton: React.FC<DiscordLoginButtonProps> = ({ onClick }) => {
  return (
    <Tooltip text="Logar com o Discord">
        <button
            onClick={onClick}
            className="flex items-center justify-center w-10 h-10 bg-[#5865F2] rounded-full hover:bg-[#4752C4] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            aria-label="Logar com o Discord"
        >
            <DiscordIcon className="w-6 h-6 text-white" />
        </button>
    </Tooltip>
  );
};