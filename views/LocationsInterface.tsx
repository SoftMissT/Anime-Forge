import React, { useState, useCallback } from 'react';
// FIX: Replaced non-existent hooks with correct ones from AppContext
import { useAppCore, useForge } from '../contexts/AppContext';
import { FiltersPanel } from './locations/FiltersPanel';
import { ResultsPanel } from './locations/ResultsPanel';
// FIX: Imported SelectOption from types.ts
import type { SelectOption } from '../types';
// FIX: Imported LocationItem from types.ts
import type { LocationItem, GeneratedItem } from '../types';
// FIX: Imported constants
import { LOCATION_BIOMES, LOCATION_ATMOSPHERES } from '../constants';

export interface LocationFiltersState {
    prompt: string;
    biome: SelectOption | null;
    atmosphere: SelectOption | null;
    generatePointsOfInterest: boolean;
}

const initialFiltersState: LocationFiltersState = {
    prompt: '',
    biome: LOCATION_BIOMES[0],
    atmosphere: LOCATION_ATMOSPHERES[0],
    generatePointsOfInterest: true,
};

const LocationsInterface: React.FC = () => {
    // FIX: Corrected hook usage
    const { loadingState, setLoadingState, appError: error, setAppError: setError } = useAppCore();
    const { history, addHistoryItem, toggleFavorite, setSelectedItem: openDetailModal } = useForge();
    const [filters, setFilters] = useState<LocationFiltersState>(initialFiltersState);
    
    const handleGenerate = useCallback(async () => {
        setLoadingState({ active: true });
        setError(null);

        try {
            if (!filters.prompt || !filters.biome || !filters.atmosphere) {
                throw new Error("Por favor, descreva o conceito e selecione o bioma e a atmosfera do local.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'locations', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar local.';
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
                id: `loc-${Date.now()}`,
                nome: parsedResponse.name,
                descricao: parsedResponse.description,
                descricao_curta: parsedResponse.description.substring(0, 100) + '...',
                categoria: 'Local/Cenário',
                is_favorite: false,
                createdAt: new Date().toISOString(),
                ...parsedResponse,
                raridade: 'Incomum',
                nivel_sugerido: 5,
                ganchos_narrativos: [],
            };
            addHistoryItem(newItem);

        } catch (e: any) {
            console.error("Erro durante a criação de local:", e);
            setError({ message: e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.' });
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, addHistoryItem, setLoadingState, setError]);

    const handleViewDetails = (item: GeneratedItem) => {
        const detailItem = {
            ...item,
            content: `${item.descricao}\n\n**Pontos de Interesse:**\n${(item as any).pointsOfInterest || 'Nenhum'}`,
        }
        openDetailModal(detailItem);
    };

    const locationHistory = history.filter(item => item.categoria === 'Local/Cenário');

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
                results={locationHistory as unknown as LocationItem[]}
                isLoading={loadingState.active}
                error={error?.message || null}
                onRetry={handleGenerate}
                onViewDetails={handleViewDetails as any}
                onToggleFavorite={toggleFavorite as any}
            />
        </div>
    );
};

export default LocationsInterface;