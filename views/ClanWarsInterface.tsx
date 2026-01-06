import React, { useState, useCallback } from 'react';
// FIX: Replaced non-existent hooks with correct ones from AppContext
import { useAppCore, useForge } from '../contexts/AppContext';
import { FiltersPanel } from './conflicts/FiltersPanel';
import { ResultsPanel } from './conflicts/ResultsPanel';
// FIX: Imported SelectOption from types.ts
import type { SelectOption } from '../types';
// FIX: Imported ConflictItem from types.ts
import type { ConflictItem, GeneratedItem } from '../types';
// FIX: Imported constants
import { CONFLICT_SCALES, CONFLICT_TYPES, FACTIONS } from '../constants';


export interface ConflictFiltersState {
    prompt: string;
    scale: number;
    missionType: SelectOption | null;
    factions: SelectOption[];
    addPlotTwist: boolean;
}

const initialFiltersState: ConflictFiltersState = {
    prompt: '',
    scale: 50,
    missionType: CONFLICT_TYPES[0],
    factions: [FACTIONS[0], FACTIONS[1]],
    addPlotTwist: false,
};

const ClanWarsInterface: React.FC = () => {
    // FIX: Corrected hook usage
    const { loadingState, setLoadingState, appError: error, setAppError: setError } = useAppCore();
    const { history, addHistoryItem, toggleFavorite, setSelectedItem: openDetailModal } = useForge(); // useForge for modal
    const [filters, setFilters] = useState<ConflictFiltersState>(initialFiltersState);
    
    const handleGenerate = useCallback(async () => {
        setLoadingState({ active: true });
        setError(null);

        try {
            if (!filters.prompt || !filters.missionType || filters.factions.length < 2) {
                throw new Error("Por favor, descreva o objetivo, selecione um tipo de missão e pelo menos duas facções.");
            }
            
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'conflicts', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar conflito.';
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
                id: `conflict-${Date.now()}`,
                nome: parsedResponse.name,
                descricao: parsedResponse.synopsis,
                descricao_curta: parsedResponse.synopsis.substring(0, 100) + '...',
                categoria: 'Guerra de Clãs',
                is_favorite: false,
                createdAt: new Date().toISOString(),
                ...parsedResponse,
                raridade: 'Épica',
                nivel_sugerido: 15,
                ganchos_narrativos: [],
            };
            addHistoryItem(newItem);

        } catch (e: any) {
            console.error("Erro durante a geração de conflito:", e);
            setError({ message: e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.' });
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, addHistoryItem, setLoadingState, setError]);

    const handleViewDetails = (item: GeneratedItem) => {
        openDetailModal(item);
    };
    
    const conflictHistory = history.filter(item => item.categoria === 'Guerra de Clãs');

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
                results={conflictHistory as unknown as ConflictItem[]}
                isLoading={loadingState.active}
                error={error?.message || null}
                onRetry={handleGenerate}
                onViewDetails={handleViewDetails as any}
                onToggleFavorite={toggleFavorite as any}
            />
        </div>
    );
};

export { ClanWarsInterface };