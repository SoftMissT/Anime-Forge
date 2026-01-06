import React, { useState, useCallback } from 'react';
// FIX: Replaced non-existent hooks with correct ones from AppContext
import { useAppCore, useMasterTools } from '../contexts/AppContext';
import { FiltersPanel } from './master_tools/FiltersPanel';
import { ResultsPanel } from './master_tools/ResultsPanel';
// FIX: Imported SelectOption from types.ts
import type { SelectOption } from '../types';
// FIX: Imported MasterToolItem from types.ts
import type { MasterToolItem } from '../types';
// FIX: Imported constants
import { MASTER_TOOL_TYPES, NAME_CATEGORIES, PLOT_HOOK_GENRES, ONOMATOPOEIA_TYPES } from '../constants';

export interface MasterToolFiltersState {
    prompt: string;
    toolType: SelectOption | null;
    category: SelectOption | null;
    genre: SelectOption | null;
    soundType: SelectOption | null;
    quantity: number;
}

const initialFiltersState: MasterToolFiltersState = {
    prompt: '',
    toolType: MASTER_TOOL_TYPES[0],
    category: NAME_CATEGORIES[0],
    genre: PLOT_HOOK_GENRES[0],
    soundType: ONOMATOPOEIA_TYPES[0],
    quantity: 5,
};

const MasterToolsInterface: React.FC = () => {
    // FIX: Corrected hook usage
    const { loadingState, setLoadingState, appError: error, setAppError: setError } = useAppCore();
    const { history, setHistory, toggleFavorite } = useMasterTools();
    const [filters, setFilters] = useState<MasterToolFiltersState>(initialFiltersState);

    const handleGenerate = useCallback(async () => {
        setLoadingState({ active: true });
        setError(null);

        try {
            if (!filters.toolType) {
                throw new Error("Por favor, selecione uma ferramenta para usar.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'master_tools', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao usar a ferramenta.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const resultsArray = JSON.parse(responseText);

            const newItems: MasterToolItem[] = resultsArray.map((content: string, index: number) => ({
                id: `tool-${filters.toolType?.value}-${Date.now()}-${index}`,
                content,
                toolType: filters.toolType?.label || 'Desconhecido',
                isFavorite: false,
            }));

            setHistory(prev => [...newItems, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração com ferramenta:", e);
            setError({ message: e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.' });
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, setHistory, setLoadingState, setError]);

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
                results={history}
                isLoading={loadingState.active}
                error={error?.message || null}
                onRetry={handleGenerate}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default MasterToolsInterface;