// src/views/CosmakerInterface.tsx
import React, { useState, useCallback } from 'react';
import { useAppCore, useAuth, useUsage, useCosmaker } from '../contexts/AppContext';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import { AuthOverlay } from '../components/AuthOverlay';
import { Button, Spinner, TextArea, Select } from '../components/ui';
// FIX: Ensure correct import from icons index
import { CopyIcon, SparklesIcon } from '../components/icons/index';
import { useToast } from '../components/ToastProvider';
import { motion } from 'framer-motion';
import { COSMAKER_ART_STYLES } from '../constants';
import type { CosmakerItem, FilterState, GeneratedItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const CosmakerInterface: React.FC = () => {
    const { setAppError } = useAppCore();
    const { isAuthenticated, handleLoginClick } = useAuth();
    const { history, setHistory, toggleFavorite } = useCosmaker();
    const { showToast } = useToast();

    const [prompt, setPrompt] = useState('');
    const [artStyle, setArtStyle] = useState(COSMAKER_ART_STYLES[0].value);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);

        const filters: FilterState = {
            category: 'Prompt Visual',
            rarity: 'Aleatória',
            level: 1,
            quantity: 1,
            promptModifier: `Estilo artístico desejado: ${artStyle}. Descrição: ${prompt}`,
            thematics: [],
            country: 'Japão',
            tonalidade: 'Aleatória'
        };

        try {
            // Reutiliza a orquestração para gerar o JSON do prompt visual
            const resultRaw = await orchestrateGeneration(filters, prompt);
            // O backend deve retornar um objeto que bate com o schema de 'Prompt Visual' definido no promptBuilder
            const result = resultRaw as any; 

            const newItem: CosmakerItem = {
                id: uuidv4(),
                prompt: prompt,
                visualDescription: result.visualDescription || result.descricao || "Sem descrição visual.",
                generatedPrompt: result.generatedPrompt || result.imagePromptDescription || "Prompt não gerado.",
                isFavorite: false,
            };

            setHistory(prev => [newItem, ...prev]);
            showToast('success', 'Prompt visual forjado com sucesso!');

        } catch (error: any) {
            setAppError({ message: 'Falha na Criação do Prompt', details: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('success', 'Copiado para a área de transferência!');
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
            {!isAuthenticated && <AuthOverlay onLoginClick={handleLoginClick} title="Acesso ao Visualizador" />}
            
            {/* Input Panel */}
            <aside className="w-full md:w-1/3 flex flex-col gap-4 bg-gray-900/50 p-4 rounded-lg border border-[var(--border-color)] overflow-y-auto">
                <h2 className="text-xl font-bold font-gangofthree text-white">Configuração Visual</h2>
                
                <Select 
                    label="Estilo Artístico" 
                    options={COSMAKER_ART_STYLES} 
                    value={artStyle as string} 
                    onChange={v => setArtStyle(v)} 
                />

                <TextArea
                    label="Descreva o Personagem ou Cena"
                    placeholder="Ex: Um Hashira da Névoa lutando contra um Oni aranha em uma floresta de bambu sob o luar..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    disabled={isLoading}
                />

                <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    className="btn-cosmaker w-full mt-auto"
                    size="lg"
                >
                    {isLoading ? <><Spinner size="sm" /> Criando Prompt...</> : <><SparklesIcon className="w-5 h-5" /> Gerar Prompt Visual</>}
                </Button>
            </aside>

            {/* Results Panel */}
            <main className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto inner-scroll flex flex-col gap-4">
                {history.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                        <SparklesIcon className="w-16 h-16 mb-4 opacity-50" />
                        <p>Seus prompts gerados aparecerão aqui.</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4 flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-white text-lg">Conceito Visual</h3>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => toggleFavorite(item)}>
                                        {item.isFavorite ? '★' : '☆'}
                                    </Button>
                                </div>
                            </div>
                            
                            <p className="text-gray-300 text-sm italic border-l-2 border-pink-500 pl-3">
                                {item.visualDescription}
                            </p>

                            <div className="bg-black/40 p-3 rounded-md border border-gray-700 mt-2 relative group">
                                <p className="font-mono text-xs text-green-400 break-words pr-8">
                                    {item.generatedPrompt}
                                </p>
                                <button 
                                    onClick={() => handleCopy(item.generatedPrompt)}
                                    className="absolute top-2 right-2 p-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                                    title="Copiar Prompt"
                                >
                                    <CopyIcon className="w-4 h-4 text-white" />
                                </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Otimizado para Midjourney v6 / Nano Banana
                            </div>
                        </motion.div>
                    ))
                )}
            </main>
        </div>
    );
};

export default CosmakerInterface;