
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MidjourneyIcon } from './icons/MidjourneyIcon';
import { GptIcon } from './icons/GptIcon';
import { GeminiIcon } from './icons/GeminiIcon';
import { useToast } from './ToastProvider';
import { refinePromptWithDeepSeek } from '../lib/client/orchestrationService';
import { useAuth } from '../contexts/AppContext';

interface PromptCardProps {
    model: 'midjourney' | 'gpt' | 'gemini';
    prompt: string;
    onPromptChange: (newPrompt: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ model, prompt, onPromptChange }) => {
    const [copied, setCopied] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const { showToast } = useToast();
    const { user } = useAuth();
    const hasDeepSeekAccess = !!user;

    const modelConfig = {
        midjourney: {
            title: "Prompt para Midjourney",
            className: "model-midjourney",
            icon: <MidjourneyIcon className="w-6 h-6" />,
            links: [
                { name: 'Leonardo', url: 'https://app.leonardo.ai' }
            ]
        },
        gpt: {
            title: "Prompt para DALL-E / GPT",
            className: "model-gpt",
            icon: <GptIcon className="w-6 h-6" />,
            links: [
                { name: 'ChatGPT', url: 'https://chatgpt.com' }
            ]
        },
        gemini: {
            title: "Prompt para Gemini",
            className: "model-gemini",
            icon: <GeminiIcon className="w-6 h-6" />,
            links: [
                { name: 'Gemini', url: 'https://gemini.google.com/app' }
            ]
        }
    };

    const config = modelConfig[model];

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        showToast('success', `${config.title} copiado!`);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRefine = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!prompt || isRefining || !user) return;
        
        if (!hasDeepSeekAccess) {
            showToast('error', 'Chave da API DeepSeek não configurada.');
            return;
        }

        setIsRefining(true);
        try {
            const result = await refinePromptWithDeepSeek(prompt);
            if (result.refinedPrompt) {
                onPromptChange(result.refinedPrompt);
                showToast('success', 'Prompt refinado com DeepSeek!');
            } else {
                throw new Error('Refinamento não retornou um prompt.');
            }
        } catch (err: any) {
            showToast('error', err.message);
        } finally {
            setIsRefining(false);
        }
    }
    
    return (
        <Card className={`prompt-card flex flex-col ${config.className} !p-4 h-full`}>
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {config.icon}
                    <h3 className="text-lg font-bold text-white font-gangofthree">{config.title}</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefine}
                    disabled={!hasDeepSeekAccess || isRefining}
                    title={hasDeepSeekAccess ? "Refinar com IA (DeepSeek)" : "Adicione uma chave DeepSeek para refinar"}
                    className="!text-xs"
                >
                    <SparklesIcon className="w-4 h-4" />
                    {isRefining ? 'Refinando...' : 'Refinar'}
                </Button>
            </div>
            <div className="relative bg-gray-900/50 p-3 rounded-md text-sm text-gray-300 whitespace-pre-wrap overflow-auto flex-grow font-mono group">
                <textarea
                    className="w-full h-full bg-transparent border-none focus:outline-none resize-none text-gray-300 font-mono text-sm pr-12"
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    rows={6}
                />
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="!absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity !p-1.5"
                    onClick={handleCopy}
                    title={copied ? "Copiado!" : "Copiar prompt"}
                >
                    {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                </Button>
            </div>
            <div className="prompt-card-actions">
                <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="prompt-action-btn">
                    <Button variant="secondary" size="sm" className="w-full">
                        <GeminiIcon className="w-4 h-4" /> Abrir no Gemini
                    </Button>
                </a>
                 <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="prompt-action-btn">
                    <Button variant="secondary" size="sm" className="w-full">
                        <GptIcon className="w-4 h-4" /> Abrir no ChatGPT
                    </Button>
                </a>
                 <a href="https://app.leonardo.ai" target="_blank" rel="noopener noreferrer" className="prompt-action-btn">
                    <Button variant="secondary" size="sm" className="w-full">
                        <MidjourneyIcon className="w-4 h-4" /> Abrir no Leonardo
                    </Button>
                </a>
            </div>
        </Card>
    );
};