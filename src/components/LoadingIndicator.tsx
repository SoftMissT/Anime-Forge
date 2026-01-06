import React, { useState, useEffect } from 'react';
import { Spinner } from './ui/Spinner';

const MESSAGES = [
    'Consultando oráculos ancestrais...',
    'Forjando uma lenda a partir do éter...',
    'Invocando musas da criatividade...',
    'Destilando a essência da imaginação...',
    'Traduzindo conceitos para a linguagem dos deuses...',
    'Aguardando a conjunção cósmica ideal...',
    'Forjando prompt lendário...',
    'Invocando inspiração dos ventos...',
];

interface LoadingIndicatorProps {
    text?: string;
    duration?: number; // duration in seconds
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text, duration = 8 }) => {
    const [message, setMessage] = useState(MESSAGES[0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar
        let start: number | null = null;
        let animationFrameId: number;
        const animationDuration = duration * 1000;

        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const newProgress = Math.min((elapsed / animationDuration) * 100, 100);
            setProgress(newProgress);
            if (elapsed < animationDuration) {
                animationFrameId = window.requestAnimationFrame(step);
            }
        };
        animationFrameId = window.requestAnimationFrame(step);

        // Cycle through messages
        const messageIntervalId = setInterval(() => {
            setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
        }, 2000);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            clearInterval(messageIntervalId);
        };
    }, [duration]);

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-800/50 rounded-lg w-full max-w-md">
            <Spinner size="md" />
            <p className="mt-4 text-lg font-semibold text-indigo-400">{text || 'Gerando...'}</p>
            <p className="mt-2 text-gray-400 transition-opacity duration-500 h-6">{message}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-150 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};