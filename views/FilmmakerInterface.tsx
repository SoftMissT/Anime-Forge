import React, { useState, useCallback, useEffect } from 'react';
import { useAppCore, useFilmmaker } from '../contexts/AppContext';
import { FiltersPanel } from './filmmaker/FiltersPanel';
import { ResultsPanel } from './filmmaker/ResultsPanel';
import type { SelectOption } from '../types';
import type { FilmmakerItem } from '../types';
// FIX: Use absolute import for constants
import { VIDEO_ASPECT_RATIOS, VIDEO_RESOLUTIONS } from '@/constants';

export interface FilmmakerFiltersState {
    prompt: string;
    aspectRatio: SelectOption | null;
    resolution: SelectOption | null;
}

const initialFiltersState: FilmmakerFiltersState = {
    prompt: '',
    aspectRatio: VIDEO_ASPECT_RATIOS[0],
    resolution: VIDEO_RESOLUTIONS[0],
};

const FilmmakerInterface: React.FC = () => {
    const { loadingState, setLoadingState, appError: error, setAppError: setError } = useAppCore();
    const { history, setHistory, toggleFavorite } = useFilmmaker();
    const [filters, setFilters] = useState<FilmmakerFiltersState>(initialFiltersState);
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleGenerate = useCallback(async () => {
        setLoadingState({ active: true, content: 'video_generation' });
        setError(null);

        try {
            if (!filters.prompt || !filters.aspectRatio || !filters.resolution) {
                throw new Error("Por favor, insira um prompt e selecione a proporção e resolução.");
            }

            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ view: 'filmmaker', filters }),
            });

            const responseText = await res.text();

            if (!res.ok) {
                let message = 'Falha ao gerar a descrição da cena.';
                try {
                    const errorData = JSON.parse(responseText);
                    message = errorData.message || message;
                } catch (e) {
                    console.error("Non-JSON error response from server:", responseText);
                }
                throw new Error(message);
            }

            const { description } = JSON.parse(responseText);

            if (!description) {
                throw new Error("A IA não retornou uma descrição de cena.");
            }
            
            const newItem: FilmmakerItem = {
                id: `filmmaker-${Date.now()}`,
                prompt: filters.prompt,
                script: description,
                videoPrompt: "Video prompt not generated via filters panel yet.",
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração de cena:", e);
            setError({ message: e.message || 'Ocorreu um erro desconhecido ao gerar a descrição da cena.' });
        } finally {
            setLoadingState({ active: false, content: 'generic' });
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
                loadingMessage={loadingState.content === 'video_generation' ? 'Escrevendo a cena...' : ''}
                error={error?.message || null}
                onRetry={handleGenerate}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default FilmmakerInterface;