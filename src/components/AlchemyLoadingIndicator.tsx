

import React, { useState, useEffect } from 'react';
import { CauldronIcon } from './icons/CauldronIcon';
import { TypingLoader } from './TypingLoader';

const MESSAGES = [
    'Destilando a essência do prompt...',
    'Consultando o grimório de prompts...',
    'Misturando palavras-chave potentes...',
    'Aguardando a transmutação criativa...',
    'Canalizando energias arcanas...',
    'Alquimia em progresso...',
    'Decifrando runas de estilo...',
    'O caldeirão da imaginação ferve...',
];

export const AlchemyLoadingIndicator: React.FC = () => {
    const [message, setMessage] = useState(MESSAGES[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 w-full h-full alchemy-loader">
            <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-red-400 blur-2xl opacity-40 animate-pulse"></div>
                <CauldronIcon className="w-24 h-24 text-gray-400 animate-pulse-slow" />
                 <div className="cauldron-bubbles">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <h3 className="text-xl font-bold font-gangofthree text-white">Destilando...</h3>
            <TypingLoader text={message} className="text-gray-400 mt-2 h-5" />
        </div>
    );
};
