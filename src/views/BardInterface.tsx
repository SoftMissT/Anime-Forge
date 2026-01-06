// src/views/BardInterface.tsx
import React, { useState } from 'react';
import { useAppCore, useAuth } from '../contexts/AppContext';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import { AuthOverlay } from '../components/AuthOverlay';
import { Button, Spinner, TextArea, Select } from '../components/ui';
// FIX: Ensure correct import from icons index
import { MusicIcon, CopyIcon } from '../components/icons/index';
import { useToast } from '../components/ToastProvider';
import { motion } from 'framer-motion';
import type { FilterState, BardItem } from '../types';
import { MUSICAL_STYLES } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';

export const BardInterface: React.FC = () => {
    const { setAppError } = useAppCore();
    const { isAuthenticated, handleLoginClick } = useAuth();
    const { showToast } = useToast();
    
    // Local history for Bard since we didn't add a specific provider context yet, 
    // or we could add one later. Using local storage for now.
    const [history, setHistory] = useLocalStorage<BardItem[]>('bard-history', []);

    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState(MUSICAL_STYLES[0].value);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);

        const filters: FilterState = {
            category: 'Música/Poesia',
            rarity: 'Aleatória',
            level: 1,
            quantity: 1,
            promptModifier: prompt,
            musicalStyle: style as string,
            thematics: [],
            tonalidade: 'Aleatória',
            country: 'Aleatório'
        };

        try {
            const resultRaw = await orchestrateGeneration(filters, prompt);
            const result = resultRaw as any;

            const newItem: BardItem = {
                id: uuidv4(),
                title: result.title || "Canção Sem Nome",
                lyrics: result.lyrics || result.descricao || "Sem letra gerada.",
                style: result.style || (style as string),
                isFavorite: false,
            };

            setHistory(prev => [newItem, ...prev]);
            showToast('success', 'Nova canção composta!');

        } catch (error: any) {
            setAppError({ message: 'Falha na Composição', details: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('success', 'Letra copiada!');
    };

    const toggleFavorite = (id: string) => {
        setHistory(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
            {!isAuthenticated && <AuthOverlay onLoginClick={handleLoginClick} title="Acesso à Taverna do Bardo" />}
            
            <aside className="w-full md:w-1/3 flex flex-col gap-4 bg-gray-900/50 p-4 rounded-lg border border-[var(--border-color)] overflow-y-auto">
                <h2 className="text-xl font-bold font-gangofthree text-white">Compor Nova Obra</h2>
                
                <Select 
                    label="Estilo Musical" 
                    options={MUSICAL_STYLES} 
                    value={style as string} 
                    onChange={v => setStyle(v)} 
                />

                <TextArea
                    label="Tema ou História da Canção"
                    placeholder="Ex: Uma balada triste sobre um caçador que teve que matar seu irmão transformado em Oni..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    disabled={isLoading}
                />

                <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 w-full mt-auto text-white shadow-lg shadow-pink-900/20"
                    size="lg"
                >
                    {isLoading ? <><Spinner size="sm" /> Compondo...</> : <><MusicIcon className="w-5 h-5" /> Criar Letra</>}
                </Button>
            </aside>

            <main className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto inner-scroll grid grid-cols-1 lg:grid-cols-2 gap-4 content-start">
                {history.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-gray-500 h-full min-h-[300px]">
                        <MusicIcon className="w-16 h-16 mb-4 opacity-50" />
                        <p>O silêncio reina. Componha algo para preenchê-lo.</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 shadow-md flex flex-col h-auto max-h-[600px]"
                        >
                            <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-2">
                                <div>
                                    <h3 className="font-bold text-white text-lg font-gangofthree">{item.title}</h3>
                                    <span className="text-xs text-pink-400 font-mono">{item.style}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(item.id)}>
                                    {item.isFavorite ? '★' : '☆'}
                                </Button>
                            </div>

                            <div className="flex-grow overflow-y-auto inner-scroll bg-black/30 p-4 rounded-md mb-4 text-center italic text-gray-300 font-serif leading-relaxed whitespace-pre-wrap">
                                {item.lyrics}
                            </div>

                            <Button variant="secondary" size="sm" className="w-full" onClick={() => handleCopy(item.lyrics)}>
                                <CopyIcon className="w-4 h-4" /> Copiar Letra
                            </Button>
                        </motion.div>
                    ))
                )}
            </main>
        </div>
    );
};