import React, { useState, useCallback } from 'react';
// FIX: Changed useCoreUI to useAppCore
import { useAppCore } from '../contexts/AppContext';
import { FiltersPanel } from './alchemist/FiltersPanel';
import { ResultsPanel } from './alchemist/ResultsPanel';
// FIX: Imported SelectOption from types.ts
import type { SelectOption } from '../types';
// FIX: Imported AlchemistItem from types.ts
import type { AlchemistItem } from '../types';
// FIX: Added AI_MODELS to constants export
import { AI_MODELS } from '../constants';

export interface AlchemistState {
    systemInstruction: string;
    prompt: string;
    model: SelectOption | null;
    temperature: number;
    topP: number;
    topK: number;
}

const initialAlchemistState: AlchemistState = {
    systemInstruction: '',
    prompt: '',
    model: AI_MODELS[0],
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
};

const AlchemistInterface: React.FC = () => {
    const { loadingState, setLoadingState, appError: error, setAppError: setError } = useAppCore();
    // FIX: Use local state for history to avoid type conflicts with the shared AlchemyContext.
    const [history, setHistory] = useState<AlchemistItem[]>([]);
    const [filters, setFilters] = useState<AlchemistState>(initialAlchemistState);

    const addHistoryItem = (item: AlchemistItem) => {
        setHistory(prev => [item, ...prev]);
    };

    const handleGenerate = useCallback(async () => {
        setLoadingState({ active: true });
        setError(null);

        try {
            if (!filters.prompt || !filters.model) {
                throw new Error("Por favor, insira um prompt e selecione um modelo de IA.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'alchemist', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha na alquimia.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const { response: textResponse } = JSON.parse(responseText);
            
            if (!textResponse) {
                throw new Error("A IA não retornou uma resposta.");
            }

            const newItem: AlchemistItem = {
                id: `alchemy-${Date.now()}`,
                response: textResponse,
                prompt: filters.prompt,
                parameters: {
                    model: filters.model.label,
                    temperature: filters.temperature,
                    topP: filters.topP,
                    topK: filters.topK,
                },
                isFavorite: false,
            };
            addHistoryItem(newItem);

        } catch (e: any) {
            console.error("Erro durante a alquimia:", e);
            setError({ message: e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.' });
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, addHistoryItem, setLoadingState, setError]);
    
    return (
        <div className='flex-grow flex flex-col md:flex-row h-full overflow-hidden'>
            <FiltersPanel 
                filters={filters}
                setFilters={setFilters}
                onGenerate={handleGenerate}
                isLoading={loadingState.active}
                onClear={() => setFilters(initialAlchemistState)}
            />
            <ResultsPanel
                results={history}
                isLoading={loadingState.active}
                error={error?.message || null}
                onRetry={handleGenerate}
                onToggleFavorite={() => {}}
            />
        </div>
    );
};

export default AlchemistInterface;