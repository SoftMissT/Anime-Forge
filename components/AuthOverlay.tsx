import React from 'react';
import { Button } from './ui/Button';
import { DiscordIcon } from './icons/DiscordIcon';

interface AuthOverlayProps {
  onLoginClick: () => void;
  title: string;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ onLoginClick, title }) => {
    
    return (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-8 rounded-lg">
            <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-24 h-24 mb-6 opacity-80" loading="lazy" decoding="async" width="96" height="96" />
            <h3 className="text-2xl font-bold font-gangofthree text-white mb-4">{title}</h3>
            <p className="text-gray-300 mb-6 max-w-md">Esta área é exclusiva para membros autorizados. Por favor, entre com sua conta do Discord para verificar seu acesso.</p>
            <Button 
                onClick={onLoginClick} 
                size="lg"
                className="bg-[#5865F2] text-white hover:bg-[#4752C4] focus:ring-indigo-400"
            >
                <DiscordIcon className="w-5 h-5" />
                Entrar com Discord
            </Button>
        </div>
    );
};