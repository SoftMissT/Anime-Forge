// components/Header.tsx
import React, { useState, memo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth, useAppCore, useUsage, useApiKeys } from '../contexts/AppContext';
import { ShareButton } from './ShareButton';
import { AboutTooltip } from './AboutTooltip';
import { HelpIcon } from './icons/HelpIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { Tooltip } from './ui/Tooltip';
import { DiscordIcon } from './icons/DiscordIcon';
import { ClockIcon, BookIcon } from './icons';
import { TabNavigation } from './TabNavigation';
import { CheckCircleIcon } from './icons';

interface HeaderProps {
    onOpenAbout: () => void;
    onOpenHowItWorks: () => void;
}

const CountdownTimer: React.FC<{ resetTimestamp: number }> = ({ resetTimestamp }) => {
    const [timeLeft, setTimeLeft] = useState(resetTimestamp - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(resetTimestamp - Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, [resetTimestamp]);

    if (timeLeft <= 0) {
        return <span className="text-sm text-gray-400">Pronto para reset!</span>;
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((timeLeft / 1000) % 60).toString().padStart(2, '0');

    return (
        <Tooltip text="Tempo para o reset do limite de gerações pesadas (imagem e vídeo)">
            <div className="flex items-center gap-1.5 text-sm text-gray-400 font-mono">
                <ClockIcon className="w-4 h-4" />
                <span>{`${hours}:${minutes}:${seconds}`}</span>
            </div>
        </Tooltip>
    );
};


export const Header = memo(({
    onOpenAbout,
    onOpenHowItWorks,
}: HeaderProps) => {
    const { activeView, openApiKeysModal, openLibraryTome } = useAppCore();
    const { user, handleLoginClick, handleLogout } = useAuth();
    const { resetTimestamp } = useUsage();
    const { geminiApiKey } = useApiKeys();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    
    return (
        <header className="app-header">
            <div className="flex items-center gap-4">
                <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10" />
                <h1 className="text-2xl font-bold font-japanese tracking-wider text-white">
                  Kimetsu Forge
                </h1>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <TabNavigation />
            </div>

            <div className="header-controls">
                {geminiApiKey ? (
                    <Tooltip text="Sua chave de API do Gemini está ativa. Uso ilimitado no app.">
                        <div className="flex items-center gap-1.5 text-sm text-green-400 font-mono">
                            <CheckCircleIcon className="w-4 h-4" />
                            <span>Ilimitado</span>
                        </div>
                    </Tooltip>
                ) : (
                    <CountdownTimer resetTimestamp={resetTimestamp} />
                )}
                <div className="hidden sm:flex items-center gap-2">
                    <ShareButton />
                    <Tooltip text="Como Funciona">
                        <button onClick={onOpenHowItWorks} className="header-icon-btn">
                            <HelpIcon className="w-6 h-6" />
                        </button>
                    </Tooltip>
                    <AboutTooltip onClick={onOpenAbout} />
                </div>
                 <Tooltip text="Tomo da Biblioteca">
                    <button onClick={() => openLibraryTome({ view: activeView, tab: 'history' })} className="header-icon-btn">
                        <BookIcon className="w-6 h-6" />
                    </button>
                </Tooltip>
                <Tooltip text="Configurar Chaves de API">
                    <button onClick={openApiKeysModal} className="header-icon-btn">
                        <SettingsIcon className="w-6 h-6" />
                    </button>
                </Tooltip>
                
                {user ? (
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="user-avatar-btn"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            width="40"
                            height="40"
                        />
                        
                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="absolute top-full right-0 mt-3 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-[110] origin-top-right"
                                    onMouseLeave={() => setIsUserMenuOpen(false)}
                                >
                                    <div className="p-3 border-b border-gray-700">
                                        <p className="font-semibold text-white truncate">{user.username}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-b-lg"
                                    >
                                        Sair
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <button onClick={handleLoginClick} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700">
                        <DiscordIcon className="w-5 h-5" />
                        Entrar com Discord
                    </button>
                )}
            </div>
        </header>
    );
});

Header.displayName = 'Header';