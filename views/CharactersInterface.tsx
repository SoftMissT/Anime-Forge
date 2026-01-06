import React, { useState, useCallback, useEffect } from 'react';
// FIX: Replaced non-existent hooks with correct ones from AppContext
import { useAppCore, useForge } from '../contexts/AppContext';
import { FiltersPanel } from './characters/FiltersPanel';
import { ResultsPanel } from './characters/ResultsPanel';
// FIX: Imported SelectOption from types.ts
import type { SelectOption } from '../types';
// FIX: Imported CharacterItem from types.ts
import type { CharacterItem, GeneratedItem } from '../types';
// FIX: Imported constants
import { CHARACTER_AFFILIATIONS, DEMON_SLAYER_RANKS, DEMON_RANKS } from '../constants';

export interface CharacterFiltersState {
    prompt: string;
    affiliation: SelectOption | null;
    rank: SelectOption | null;
    personalityTraits: SelectOption[];
    generateUniqueAbility: boolean;
}

const initialFiltersState: CharacterFiltersState = {
    prompt: '',
    affiliation: CHARACTER_AFFILIATIONS[0],
    rank: DEMON_SLAYER_RANKS[0],
    personalityTraits: [],
    generateUniqueAbility: true,
};

const CharactersInterface: React.FC = () => {
    // FIX: Corrected hook usage
    const { loadingState, setLoadingState, appError: error, setAppError: setError } = useAppCore();
    const { history, addHistoryItem, toggleFavorite, setSelectedItem: openDetailModal } = useForge();
    const [filters, setFilters] = useState<CharacterFiltersState>(initialFiltersState);

    useEffect(() => {
        if (filters.affiliation?.value === 'demon_slayer') {
            setFilters(f => ({ ...f, rank: DEMON_SLAYER_RANKS[0] }));
        } else if (filters.affiliation?.value === 'demon') {
            setFilters(f => ({ ...f, rank: DEMON_RANKS[0] }));
        } else {
            setFilters(f => ({ ...f, rank: null }));
        }
    }, [filters.affiliation]);
    
    const handleGenerate = useCallback(async () => {
        setLoadingState({ active: true });
        setError(null);

        try {
            if (!filters.prompt || !filters.affiliation) {
                throw new Error("Por favor, descreva o conceito do personagem e selecione uma afiliação.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'characters', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar personagem.';
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
                id: `char-${Date.now()}`,
                nome: parsedResponse.name,
                descricao: parsedResponse.backstory,
                descricao_curta: parsedResponse.backstory.substring(0,100) + '...',
                categoria: filters.affiliation.value === 'demon' ? 'Inimigo/Oni' : 'Caçador',
                is_favorite: false,
                createdAt: new Date().toISOString(),
                ...parsedResponse,
                raridade: 'Rara',
                nivel_sugerido: 10,
                ganchos_narrativos: [],
            };
            addHistoryItem(newItem);

        } catch (e: any) {
            console.error("Erro durante a criação de personagem:", e);
            setError({ message: e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.' });
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, addHistoryItem, setLoadingState, setError]);

    const handleViewDetails = (item: GeneratedItem) => {
        // FIX: Add content property for DetailModal compatibility
        const detailItem = {
            ...item,
            content: `**Aparência:**\n${(item as any).appearance}\n\n**Personalidade:**\n${(item as any).personality}\n\n**História:**\n${(item as any).backstory}\n\n**Habilidades:**\n${(item as any).abilities}`,
        }
        openDetailModal(detailItem);
    };
    
    const characterHistory = history.filter(item => item.categoria === 'Caçador' || item.categoria === 'Inimigo/Oni' || item.categoria === 'NPC');

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
                results={characterHistory as unknown as CharacterItem[]}
                isLoading={loadingState.active}
                error={error?.message || null}
                onRetry={handleGenerate}
                onViewDetails={handleViewDetails as any}
                onToggleFavorite={toggleFavorite as any}
            />
        </div>
    );
};

export default CharactersInterface;