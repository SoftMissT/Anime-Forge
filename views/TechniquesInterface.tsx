import React, { useState, useCallback } from 'react';
// FIX: Replaced non-existent hooks with correct ones from AppContext
import { useAppCore, useForge } from '../contexts/AppContext';
import { FiltersPanel } from './techniques/FiltersPanel';
import { ResultsPanel } from './techniques/ResultsPanel';
// FIX: Imported SelectOption from types.ts
import type { SelectOption } from '../types';
// FIX: Imported TechniqueItem from types.ts
import type { TechniqueItem, GeneratedItem } from '../types';
// FIX: Imported constants
import { TECHNIQUE_TYPES, BASE_ELEMENTS, TECHNIQUE_COMPLEXITY } from '../constants';

export interface TechniqueFiltersState {
    prompt: string;
    type: SelectOption | null;
    baseElement: SelectOption | null;
    complexity: SelectOption | null;
    generateNotableUser: boolean;
}

const initialFiltersState: TechniqueFiltersState = {
    prompt: '',
    type: TECHNIQUE_TYPES[0],
    baseElement: BASE_ELEMENTS[0],
    complexity: TECHNIQUE_COMPLEXITY[1],
    generateNotableUser: false,
};

const TechniquesInterface: React.FC = () => {
    // FIX: Corrected hook usage
    const { loadingState, setLoadingState, appError: error, setAppError: setError } = useAppCore();
    const { history, addHistoryItem, toggleFavorite, setSelectedItem: openDetailModal } = useForge();
    const [filters, setFilters] = useState<TechniqueFiltersState>(initialFiltersState);
    
    const handleGenerate = useCallback(async () => {
        setLoadingState({ active: true });
        setError(null);

        try {
            if (!filters.prompt || !filters.type || !filters.baseElement) {
                throw new Error("Por favor, descreva o conceito e selecione o tipo e o elemento base da técnica.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'techniques', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar técnica.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const parsedResponse = JSON.parse(responseText);

            const newItem: GeneratedItem = {
                id: `tech-${Date.now()}`,
                nome: parsedResponse.name,
                descricao: parsedResponse.description,
                descricao_curta: parsedResponse.description.substring(0, 100) + '...',
                categoria: filters.type.value === 'respiracao' ? 'Respiração' : 'Kekkijutsu',
                is_favorite: false,
                createdAt: new Date().toISOString(),
                ...parsedResponse,
                raridade: 'Épica',
                nivel_sugerido: 12,
                ganchos_narrativos: [],
            };
            addHistoryItem(newItem);

        } catch (e: any) {
            console.error("Erro durante a criação de técnica:", e);
            setError({ message: e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.' });
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, addHistoryItem, setLoadingState, setError]);

    const handleViewDetails = (item: GeneratedItem) => {
        openDetailModal(item);
    };

    const techniqueHistory = history.filter(item => item.categoria === 'Respiração' || item.categoria === 'Kekkijutsu');

    return (
        <div className='flex-grow flex flex-col md:flex-row h-full overflow-hidden'>
            <FiltersPanel 
                filters={filters}
                setFilters={setFilters}
                onGenerate={handleGenerate}
                isLoading={loadingState.active}
                onClear={() => setFilters(initialFiltersState)}
            />
            <ResultsPanel
                results={techniqueHistory as unknown as TechniqueItem[]}
                isLoading={loadingState.active}
                error={error?.message || null}
                onRetry={handleGenerate}
                onViewDetails={handleViewDetails as any}
                onToggleFavorite={toggleFavorite as any}
            />
        </div>
    );
};

export default TechniquesInterface;