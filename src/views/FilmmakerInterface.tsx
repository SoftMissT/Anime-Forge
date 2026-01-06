// src/views/FilmmakerInterface.tsx
import React, { useState } from 'react';
import { useAppCore, useAuth, useFilmmaker } from '../contexts/AppContext';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import { AuthOverlay } from '../components/AuthOverlay';
import { Button, Spinner, TextArea } from '../components/ui';
// FIX: Ensure correct import from icons index
import { CopyIcon, VideoIcon } from '../components/icons/index';
import { useToast } from '../components/ToastProvider';
import { motion } from 'framer-motion';
import type { FilmmakerItem, FilterState } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const FilmmakerInterface: React.FC = () => {
    const { setAppError } = useAppCore();
    const { isAuthenticated, handleLoginClick } = useAuth();
    const { history, setHistory, toggleFavorite } = useFilmmaker();
    const { showToast } = useToast();

    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);

        const filters: FilterState = {
            category: 'Roteiro',
            rarity: 'Aleatória',
            level: 1,
            quantity: 1,
            promptModifier: `Cena: ${prompt}`,
            thematics: [],
            country: 'Japão',
            tonalidade: 'Cinematográfica'
        };

        try {
            const resultRaw = await orchestrateGeneration(filters, prompt);
            const result = resultRaw as any;

            const newItem: FilmmakerItem = {
                id: uuidv4(),
                prompt: prompt,
                script: result.script || result.descricao || "Sem roteiro gerado.",
                videoPrompt: result.videoPrompt || result.videoPromptDescription || "Sem prompt de vídeo.",
                isFavorite: false,
            };

            setHistory(prev => [newItem, ...prev]);
            showToast('success', 'Roteiro e prompt de vídeo criados!');

        } catch (error: any) {
            setAppError({ message: 'Falha na Geração do Roteiro', details: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('success', 'Copiado!');
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
            {!isAuthenticated && <AuthOverlay onLoginClick={handleLoginClick} title="Acesso ao Roteirista" />}
            
            <aside className="w-full md:w-1/3 flex flex-col gap-4 bg-gray-900/50 p-4 rounded-lg border border-[var(--border-color)] overflow-y-auto">
                <h2 className="text-xl font-bold font-gangofthree text-white">Sala de Roteiro</h2>
                
                <TextArea
                    label="Ideia da Cena"
                    placeholder="Ex: Tanjiro usando a Dança do Deus do Fogo pela primeira vez contra Rui..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    disabled={isLoading}
                />

                <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    className="btn-filmmaker w-full mt-auto"
                    size="lg"
                >
                    {isLoading ? <><Spinner size="sm" /> Escrevendo...</> : <><VideoIcon className="w-5 h-5" /> Gerar Roteiro e Prompt</>}
                </Button>
            </aside>

            <main className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto inner-scroll flex flex-col gap-6">
                {history.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                        <VideoIcon className="w-16 h-16 mb-4 opacity-50" />
                        <p>Seus roteiros aparecerão aqui.</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                                <h3 className="font-bold text-white text-lg font-gangofthree">{item.prompt.substring(0, 50)}...</h3>
                                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(item)}>
                                    {item.isFavorite ? '★ Favorito' : '☆ Favoritar'}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-indigo-400 font-semibold mb-2">Roteiro da Cena</h4>
                                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 bg-black/30 p-4 rounded h-64 overflow-y-auto inner-scroll border-l-2 border-indigo-500">
                                        {item.script}
                                    </pre>
                                    <Button variant="secondary" size="sm" className="mt-2 w-full" onClick={() => handleCopy(item.script)}>
                                        <CopyIcon className="w-4 h-4" /> Copiar Roteiro
                                    </Button>
                                </div>

                                <div>
                                    <h4 className="text-cyan-400 font-semibold mb-2">Prompt para IA de Vídeo (Veo/Sora)</h4>
                                    <div className="bg-black/30 p-4 rounded h-64 overflow-y-auto inner-scroll border-l-2 border-cyan-500 relative group">
                                        <p className="text-sm text-gray-300 font-mono">
                                            {item.videoPrompt}
                                        </p>
                                    </div>
                                    <Button variant="secondary" size="sm" className="mt-2 w-full" onClick={() => handleCopy(item.videoPrompt)}>
                                        <CopyIcon className="w-4 h-4" /> Copiar Prompt de Vídeo
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </main>
        </div>
    );
};

export default FilmmakerInterface;